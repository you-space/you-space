import Redis from '@ioc:Adonis/Addons/Redis'
import Logger from '@ioc:Adonis/Core/Logger'
import OriginException from 'App/Exceptions/OriginException'
import Origin, { OriginTypes } from 'App/Models/Origin'
import { OriginLogTypes } from 'App/Models/OriginLog'
import { MountedOriginProvider } from './types'
import lodash from 'lodash'
import YoutubeProvider from './video-providers/YouTubeProvider'
import Video from 'App/Models/Video'

export default class OriginService {
  private providers = {
    [OriginTypes.YouTube]: YoutubeProvider,
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

    await origin.related('videos').updateOrCreateMany(
      videos.map((v) => ({
        id: `${origin.id}-${v.videoId}`,
        videoId: v.videoId,
        originData: v.data,
      })),
      'id'
    )

    await origin.related('views').updateOrCreateMany(
      serialize.map(({ viewsCount, videoId }) => ({
        id: `${origin.id}-${videoId}`,
        videoId: `${origin.id}-${videoId}`,
        count: viewsCount,
      })),
      'id'
    )

    Logger.child({ originName: origin.name, type: origin.type, length: videos.length }).info(
      'import videos page'
    )
  }

  public serializeVideo(origin: Origin, video: Video) {
    return this.getProvider(origin).serializeVideo(video.originData)
  }
}
