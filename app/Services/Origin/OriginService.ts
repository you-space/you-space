import Logger from '@ioc:Adonis/Core/Logger'
import Redis from '@ioc:Adonis/Addons/Redis'
import OriginException from 'App/Exceptions/OriginException'
import Origin, { OriginTypes } from 'App/Models/Origin'
import { OriginVideoProvider } from './types'
import LocalProvider from './video-providers/Local'
import YoutubeProvider from './video-providers/Youtube'
import { OriginLogTypes } from 'App/Models/OriginLog'
import lodash from 'lodash'
import Comment from 'App/Models/Comment'
import Video from 'App/Models/Video'

interface AllVideoProviders {
  [prop: string]: (origin: Origin, redisKey: string) => OriginVideoProvider
}

export default class OriginService {
  private allProviders: AllVideoProviders

  constructor() {
    this.allProviders = {
      [OriginTypes.YouTube]: (origin, redisKey) => new YoutubeProvider(origin, redisKey),
      [OriginTypes.Main]: (origin, redisKey) => new LocalProvider(origin, redisKey),
    }
  }

  public getProvider(origin: Origin): OriginVideoProvider {
    if (!this.allProviders[origin.type]) {
      throw new OriginException('Provider not found', origin.type)
    }

    const redisKey = `origin:${origin.id}`
    const provider = this.allProviders[origin.type](origin, redisKey)

    if (provider.setup) {
      provider.setup()
    }

    return provider
  }

  public async checkConfig(type: OriginTypes, config: any) {
    if (type === OriginTypes.YouTube) {
      return await YoutubeProvider.checkConfig(config)
    }

    return true
  }

  public async errorHandler(error: any, origin: Origin) {
    const exception = new OriginException(error.message, origin.type, origin.name)

    Logger.child(exception).error(error.message)

    await origin.related('logs').create({
      message: error.message,
      type: OriginLogTypes.Error,
      payload: {
        config: lodash.get(error, 'config', undefined),
        response: lodash.get(error, 'response.data', undefined),
        stack: undefined,
      },
    })
  }

  public async registerVideos(origin: Origin, page: number) {
    await this._registerVideos(origin, page).catch((err) => this.errorHandler(err, origin))
  }

  private async _registerVideos(origin: Origin, page: number) {
    const provider = this.getProvider(origin)

    if (provider.preload) {
      await provider.preload(origin.config)
    }

    const totalPages = await provider.getTotalPages()
    const totalVideos = await provider.getTotalVideos()

    await origin.related('metadata').updateOrCreate({}, { totalVideos: totalVideos })

    if (totalPages < page) {
      return
    }
    const videosKey = `origin:${origin.id}:videos:page:${page}`

    const cache = await Redis.get(videosKey)

    if (cache) {
      return
    }

    const videos = await provider.getVideos(page)

    if (videos.length === 0) {
      return
    }

    const serializedVideos = videos.map((v) => v.data).map(provider.serializeVideo)

    const { length: videosLength } = await origin.related('videos').updateOrCreateMany(
      videos.map((v) => ({
        id: `${origin.id}-${v.videoId}`,
        videoId: v.videoId,
        originId: origin.id,
        originData: v.data,
      })),
      'id'
    )

    const { length: viewsLength } = await origin.related('views').updateOrCreateMany(
      serializedVideos.map((i) => ({
        id: `${origin.id}-${origin.id}-${i.videoId}`,
        videoId: `${origin.id}-${i.videoId}`,
        originId: origin.id,
        count: i.viewsCount,
      })),
      'id'
    )

    await Redis.set(videosKey, JSON.stringify(videos), 'EX', 60 * 1000 * 600)

    await origin.related('logs').create({
      message: `register/update videos page ${page}`,
      type: OriginLogTypes.Info,
      payload: {
        page,
        videosLength,
        viewsLength,
      },
    })
  }

  public async registerComments(origin: Origin, videoId: string, page: number) {
    await this._registerVideoComments(origin, videoId, page).catch((err) =>
      this.errorHandler(err, origin)
    )
  }

  private async _registerVideoComments(origin: Origin, videoId: string, page: number) {
    const provider = this.getProvider(origin)
    const commentsKey = `origin:${origin.id}:${videoId}:comments:${page}`

    const cache = await Redis.get(commentsKey)

    if (cache) {
      return
    }

    const topLevelComment = await provider.getVideoComments(videoId, Number(page))

    const repliesComments = topLevelComment
      .map((c) =>
        c.replies.map((r) => ({
          ...r,
          parentCommentId: c.commentId,
        }))
      )
      .reduce((all, c) => all.concat(c), [])

    const usersToCreate = lodash
      .unionBy(topLevelComment.concat(repliesComments), 'userId')
      .map((c) => ({
        id: `${origin.id}-${c.userId}`,
        userId: c.userId,
        originId: origin.id,
      }))

    const users = await origin.related('users').updateOrCreateMany(usersToCreate, 'id')

    const commentsToCreateOrUpdate = topLevelComment.map((c) => {
      const user = users.find((u) => u.userId === c.userId)
      const serialized = provider.serializeComment(c.data)

      return {
        id: `${origin.id}-${c.commentId}`,
        commentId: c.commentId,
        userId: user ? user.id : undefined,
        videoId: `${origin.id}-${videoId}`,
        originId: origin.id,
        originLikeCount: serialized.likeCount,
        originUnlikeCount: serialized.unlikeCount,
        originData: c.data,
      }
    })

    const repliesToCreateOrUpdate = repliesComments.map((c) => {
      const user = users.find((u) => u.userId === c.userId)
      const serialized = provider.serializeComment(c.data)

      return {
        id: `${origin.id}-${c.commentId}`,
        parentCommentId: `${origin.id}-${c.parentCommentId}`,
        commentId: c.commentId,
        userId: user ? user.id : undefined,
        videoId: `${origin.id}-${videoId}`,
        originId: origin.id,
        originLikeCount: serialized.likeCount,
        originUnlikeCount: serialized.unlikeCount,
        originData: c.data,
      }
    })

    await origin.related('comments').updateOrCreateMany(commentsToCreateOrUpdate, 'id')
    await origin.related('comments').updateOrCreateMany(repliesToCreateOrUpdate, 'id')

    await Redis.set(commentsKey, JSON.stringify(topLevelComment.concat(repliesComments)))
  }

  public serializeVideo = (origin: Origin, video: Video) => {
    return this.getProvider(origin).serializeVideo(video.originData)
  }

  public serializeComment = (origin: Origin, comment: Comment) => {
    const provider = this.getProvider(origin)
    const normalSerialize = comment.serialize()
    const originSerialize = provider.serializeComment(comment.originData)
    const replies = comment.replies.map((r) => ({
      ...r.serialize(),
      ...provider.serializeComment(r.originData),
    }))
    return {
      ...normalSerialize,
      ...originSerialize,
      replies,
    }
  }
}
