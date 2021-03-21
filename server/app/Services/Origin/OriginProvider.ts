import Video from 'App/Models/Video'
import Origin, { OriginConfig } from 'App/Models/Origin'
import YoutubeProvider from './YoutubeProvider'
import { OriginVideoProvider, VideoSerialized } from './types'
import Redis from '@ioc:Adonis/Addons/Redis'
import View from 'App/Models/View'

class OriginProvider {
  public async checkConfig(config: OriginConfig) {
    await YoutubeProvider.checkConfig(config)
  }

  public getProvider = (origin: Origin): OriginVideoProvider => {
    const redisKey = `origin:${origin.id}`
    return new YoutubeProvider(origin, redisKey)
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

  public serializeVideo = (origin: Origin, video: Video): VideoSerialized => {
    const provider: OriginVideoProvider = this.getProvider(origin)
    const normalSerialize = video.serialize()
    const originSerialize = provider.serializeVideo(video.originData)
    return {
      ...normalSerialize,
      ...originSerialize,
    }
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
}

const originProvider = new OriginProvider()

export default originProvider
