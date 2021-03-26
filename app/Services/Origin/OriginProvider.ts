import lodash from 'lodash'
import Video from 'App/Models/Video'
import Origin, { OriginConfig } from 'App/Models/Origin'
import YoutubeProvider from './YoutubeProvider'
import { OriginVideoProvider, VideoSerialized } from './types'
import Redis from '@ioc:Adonis/Addons/Redis'
import View from 'App/Models/View'
import Comment from 'App/Models/Comment'

class OriginProvider {
  public async checkConfig(config: OriginConfig) {
    await YoutubeProvider.checkConfig(config)
  }

  public getProvider = (origin: Origin): OriginVideoProvider => {
    const redisKey = `origin:${origin.id}`
    return new YoutubeProvider(origin, redisKey)
  }

  public registerOriginStatus = async (origin: Origin) => {
    const provider = await this.getProvider(origin)
    const videosRegistered = await Video.query()
      .where('originId', origin.id)
      .count('*')
      .firstOrFail()

    const totalVideos = await provider.getTotalVideos()

    await origin.related('metadata').updateOrCreate(
      {
        originId: origin.id,
      },
      {
        originId: origin.id,
        totalVideos: totalVideos,
        registeredVideos: videosRegistered.count,
      }
    )
  }

  public register = async (origin: Origin, page: number) => {
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
    const provider = this.getProvider(origin)
    const normalSerialize = video.serialize()
    const originSerialize = provider.serializeVideo(video.originData)
    return {
      ...normalSerialize,
      ...originSerialize,
    }
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
