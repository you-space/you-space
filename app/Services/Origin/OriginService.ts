import Redis from '@ioc:Adonis/Addons/Redis'
import Logger from '@ioc:Adonis/Core/Logger'
import OriginException from 'App/Exceptions/OriginException'
import Origin, { OriginTypes } from 'App/Models/Origin'
import { OriginLogTypes } from 'App/Models/OriginLog'
import { CommentSerialized, MountedOriginProvider, VideoSerialized } from './types'
import lodash from 'lodash'
import YoutubeProvider from './YouTubeProvider'
import EntityItem from 'App/Models/EntityItem'
import Entity from 'App/Models/Entity'
import Database from '@ioc:Adonis/Lucid/Database'
import LocalProvider from './LocalProvider'

/**
 * The OriginService is a class that manage origin providers
 * it call origin provider methods to get data and add/update they in the database
 */
export default class OriginService {
  private providers = {
    [OriginTypes.YouTube]: YoutubeProvider,
    [OriginTypes.Main]: LocalProvider,
  }

  public async reportError(error: Error, origin: Origin) {
    const exception = new OriginException(error.message, origin.type, origin.name)

    Logger.child(exception).error(error.message)

    await origin.related('logs').create({
      message: error.message,
      type: OriginLogTypes.Error,
      payload: {
        config: lodash.get(error, 'config', undefined),
        response: lodash.get(error, 'response.data', undefined),
      },
    })
  }

  /**
   * Method to instantiate a OriginProvider
   * it will take care of add provider helpers and origin config in instance
   * @param origin
   * @returns MountedOriginProvider
   */
  public getProvider(origin: Origin): MountedOriginProvider {
    const instance = this.providers[origin.type]

    if (!instance) {
      throw new OriginException('provider not found', origin.type, origin.name)
    }

    const provider = new this.providers[origin.type]()
    const redisKey = `origin:${origin.id}:provider:metadata`

    provider.metadata = {
      get: async () => {
        const data = await Redis.get(redisKey)
        return data ? JSON.parse(data) : {}
      },
      set: (value: any) => Redis.set(redisKey, JSON.stringify(value)),
    }

    provider.config = origin.config

    return provider
  }

  /**
   * Method to import videos of a origin and register/update they in database
   * @param origin
   * @param page
   */
  public async importVideos(origin: Origin, page: number) {
    try {
      await this._importVideos(origin, page)
    } catch (error) {
      await this.reportError(error, origin).catch((err) => {
        throw new OriginException(err.message, origin.type, origin.name)
      })
    }
  }

  private async _importVideos(origin: Origin, page: number) {
    const provider = this.getProvider(origin)

    const videos = await provider.fetchVideos(page)
    const serialize = videos.map((v) => provider.serializeVideo(v.data))

    const entityVideo = await Entity.firstOrCreate({
      name: 'video',
    })

    const trx = await Database.transaction()

    entityVideo.$trx = trx

    await Promise.all(
      videos.map(async (v) => {
        const serialize = provider.serializeVideo(v.data)
        const created = await entityVideo.related('items').updateOrCreate(
          {
            sourceId: v.videoId,
            originId: origin.id,
          },
          {
            sourceId: v.videoId,
            value: v.data,
            originId: origin.id,
          }
        )

        await created.related('metas').updateOrCreate(
          {},
          {
            name: 'sourceCount',
            value: String(serialize.viewsCount),
          }
        )
      })
    )

    await trx.commit()

    Logger.child({ originName: origin.name, type: origin.type, length: videos.length }).info(
      'import videos page'
    )
  }

  /**
   * Method to import comments of a origin and register/update they in database
   * @param origin
   * @param videoId
   * @param page
   */

  public async importComments(origin: Origin, video: EntityItem, page: number) {
    try {
      await this._importComments(origin, video, page)
    } catch (error) {
      await this.reportError(error, origin).catch((err) => {
        throw new OriginException(err.message, origin.type, origin.name)
      })
    }
  }

  private async _importComments(origin: Origin, video: EntityItem, page: number) {
    const provider = this.getProvider(origin)

    const commentsTopLevel = await provider.fetchComments(video.sourceId, page)

    const entityComment = await Entity.firstOrCreate({
      name: 'comment',
    })

    const trx = await Database.transaction()

    entityComment.$trx = trx

    await Promise.all(
      commentsTopLevel.map(async (comment) => {
        const created = await entityComment.related('items').updateOrCreate(
          {
            sourceId: comment.commentId,
            originId: origin.id,
          },
          {
            originId: origin.id,
            sourceId: comment.commentId,
            value: comment.data,
            parentId: video.id,
          }
        )

        if (comment.replies.length) {
          await entityComment.related('items').updateOrCreateMany(
            comment.replies.map((reply) => ({
              originId: origin.id,
              parentId: created.id,
              value: reply.data,
              sourceId: reply.commentId,
            })),
            ['entityId', 'originId', 'sourceId']
          )
        }
      })
    )

    await trx.commit()

    // const commentReplies = commentsTopLevel
    //   .map((c) =>
    //     c.replies.map((r) => ({
    //       ...r,
    //       parentCommentId: c.commentId,
    //     }))
    //   )
    //   .reduce((all, c) => all.concat(c), [])

    // await origin.related('comments').updateOrCreateMany(
    //   commentsTopLevel.map((c) => ({
    //     id: `${origin.id}-${c.commentId}`,
    //     commentId: c.commentId,
    //     userId: `${origin.id}-${c.userId}`,
    //     videoId: `${origin.id}-${videoId}`,
    //     originId: origin.id,
    //     originLikeCount: provider.serializeComment(c.data).likeCount,
    //     originUnlikeCount: provider.serializeComment(c.data).unlikeCount,
    //     originData: c.data,
    //   })),
    //   'id'
    // )

    // await origin.related('comments').updateOrCreateMany(
    //   commentReplies.map((c) => ({
    //     id: `${origin.id}-${c.commentId}`,
    //     commentId: c.commentId,
    //     parentCommentId: `${origin.id}-${c.parentCommentId}`,
    //     userId: `${origin.id}-${c.userId}`,
    //     videoId: `${origin.id}-${videoId}`,
    //     originId: origin.id,
    //     originLikeCount: provider.serializeComment(c.data).likeCount,
    //     originUnlikeCount: provider.serializeComment(c.data).unlikeCount,
    //     originData: c.data,
    //   })),
    //   'id'
    // )
  }

  /**
   * Method to convert video raw data in VideoSerialized
   * @param origin
   * @param video
   * @returns VideoSerialized
   */
  public serializeVideo(origin: Origin, video: EntityItem): VideoSerialized {
    return this.getProvider(origin).serializeVideo(video.value)
  }

  /**
   * Method to convert comment raw data in CommentSerialized
   * @param origin
   * @param comment
   * @returns CommentSerialized
   */
  public serializeComment(origin: Origin, comment: EntityItem): CommentSerialized {
    return this.getProvider(origin).serializeComment(comment.value)
  }
}
