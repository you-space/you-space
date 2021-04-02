import lodash from 'lodash'
import Video from 'App/Models/Video'
import Origin, { OriginConfig, OriginTypes } from 'App/Models/Origin'
import YoutubeProvider from 'App/Services/Origin/video-providers/Youtube'
import LocalProvider from 'App/Services/Origin/video-providers/Local'
import { OriginVideoProvider } from './types'
import Redis from '@ioc:Adonis/Addons/Redis'
import View from 'App/Models/View'
import Comment from 'App/Models/Comment'

interface AllVideoProviders {
  [prop: string]: (origin: Origin, redisKey: string) => OriginVideoProvider
}
class OriginProvider {
  public allProviders: AllVideoProviders

  constructor() {
    this.allProviders = {
      [OriginTypes.YouTube]: (origin, redisKey) => new YoutubeProvider(origin, redisKey),
      [OriginTypes.Main]: (origin, redisKey) => new LocalProvider(origin, redisKey),
    }
  }
  public async checkConfig(config: OriginConfig) {
    await YoutubeProvider.checkConfig(config)
  }

  public getProvider = (origin: Origin): OriginVideoProvider => {
    if (!this.allProviders[origin.type]) {
      throw new Error('[origin-provider] provider not found')
    }
    const redisKey = `origin:${origin.id}`

    return this.allProviders[origin.type](origin, redisKey)
  }

  public registerOriginStatus = async (origin: Origin) => {
    const provider = await this.getProvider(origin)
    const { $extras } = await Origin.query()
      .withCount('videos')
      .where('id', origin.id)
      .firstOrFail()

    const totalVideos = await provider.getTotalVideos()

    await origin.related('metadata').updateOrCreate(
      {
        originId: origin.id,
      },
      {
        originId: origin.id,
        totalVideos: totalVideos,
        registeredVideos: Number($extras.videos_count) || 0,
      }
    )
  }

  public registerVideos = async (origin: Origin, page: number) => {
    const provider: OriginVideoProvider = this.getProvider(origin)
    const videosKey = `origin:${origin.id}:videos:page:${page}`

    const cache = await Redis.get(videosKey)

    if (cache) {
      return
    }

    if (provider.preload) {
      await provider.preload(origin.config)
    }

    const videos = await provider.getVideos(Number(page))

    if (videos.length === 0) {
      return
    }

    const serializedVideos = videos.map((v) => v.data).map(provider.serializeVideo)

    await Video.updateOrCreateMany(
      'id',
      videos.map((v) => ({
        id: `${origin.id}-${v.videoId}`,
        videoId: v.videoId,
        originId: origin.id,
        originData: v.data,
      }))
    )

    await View.updateOrCreateMany(
      'id',
      serializedVideos.map((i) => ({
        id: `${origin.id}-${origin.id}-${i.videoId}`,
        videoId: `${origin.id}-${i.videoId}`,
        originId: origin.id,
        count: i.viewsCount,
      }))
    )

    await this.registerOriginStatus(origin)

    await Redis.set(videosKey, JSON.stringify(videos))
  }

  public serializeVideo = (origin: Origin, video: Video) => {
    return this.getProvider(origin).serializeVideo(video.originData)
  }

  public async registerVideoComments(origin: Origin, videoId: string, page: number) {
    const provider = this.getProvider(origin)
    const commentsKey = `origin:${origin.id}:${videoId}:page:${page}`

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

const originProvider = new OriginProvider()

export default originProvider
