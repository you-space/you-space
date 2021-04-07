import Logger from '@ioc:Adonis/Core/Logger'
import Redis from '@ioc:Adonis/Addons/Redis'
import OriginException from 'App/Exceptions/OriginException'
import Origin, { OriginTypes } from 'App/Models/Origin'
import { OriginVideoProvider } from './types'
import LocalProvider from './video-providers/Local'
import YoutubeProvider from './video-providers/Youtube'

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
    const provider = this.allProviders[origin.type]

    if (!provider) {
      throw new OriginException('Provider not found', origin.type)
    }

    const redisKey = `origin:${origin.id}`

    return provider(origin, redisKey)
  }

  public async checkConfig(type: OriginTypes, config: any) {
    if (type === OriginTypes.YouTube) {
      return await YoutubeProvider.checkConfig(config)
    }

    return true
  }

  public async registerVideos(origin: Origin, page: number) {
    try {
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

      await origin.related('videos').updateOrCreateMany(
        videos.map((v) => ({
          id: `${origin.id}-${v.videoId}`,
          videoId: v.videoId,
          originId: origin.id,
          originData: v.data,
        })),
        'id'
      )

      await origin.related('views').updateOrCreateMany(
        serializedVideos.map((i) => ({
          id: `${origin.id}-${origin.id}-${i.videoId}`,
          videoId: `${origin.id}-${i.videoId}`,
          originId: origin.id,
          count: i.viewsCount,
        })),
        'id'
      )

      await Redis.set(videosKey, JSON.stringify(videos), 'EX', 60 * 1000 * 600)
    } catch (error) {
      const exception = new OriginException(error.message, origin.type, origin.name)
      Logger.child(exception).error(error.message)
    }
  }
}
