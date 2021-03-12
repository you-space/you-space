import { ApplicationContract } from '@ioc:Adonis/Core/Application'
import axios, { AxiosInstance, AxiosResponse } from 'axios'
import Origin from 'App/Models/Origin'

export interface YouTubeProvider {
  videos: {
    index(origin: Origin): Promise<any[]>
  }
}

export interface YouTubeSearchParams {
  key: string
  part: string
  [prop: string]: any
}

export default class YouTubeVideoProvider {
  public static needsApplication = true
  public apiUrl = 'https://www.googleapis.com/youtube/v3'
  public axios: AxiosInstance

  constructor(protected application: ApplicationContract) {
    this.axios = axios.create({
      baseURL: this.apiUrl,
    })
  }

  public register() {
    this.application.container.singleton(
      'Providers/YouTube',
      (): YouTubeProvider => ({
        videos: {
          index: this.index.bind(this),
        },
      })
    )
  }

  public async invoke<T extends {}>(path: string, config: any): Promise<any> {
    try {
      return await this.axios.get<T>(path, {
        params: config.params,
      })
    } catch (error) {
      console.log(error.response.data)
    }
  }

  public serializeVideosResponse(origin: Origin, items: any[]) {
    return items.map((i) => {
      let videoId = i.id.videoId

      if (typeof i.id === 'string') {
        videoId = i.id
      }

      return {
        name: i.snippet.title,
        videoId: videoId,
        type: origin.type,
        originId: origin.id,
        src: `http://www.youtube.com/embed/${videoId}`,
        thumbSrc: i.snippet.thumbnails.default.url,
        viewCount: i.statistics ? i.statistics.viewCount : 0,
        likeCount: i.statistics ? i.statistics.viewCount : 0,
      }
    })
  }

  public async getVideos(params: YouTubeSearchParams) {
    const { data: searchData } = await this.invoke<any>('search', {
      params: params,
    })

    const videos = searchData.items.filter((i) => i.id.kind === 'youtube#video')

    const videoIds = searchData.items.map((i) => i.id.videoId)

    const { data: statisticsData } = await this.invoke('videos', {
      params: {
        key: params.key,
        part: 'statistics',
        id: videoIds.join(),
      },
    })

    return videos.map((i) => {
      const statisticItem = statisticsData.items.find((s) => s.id === i.id.videoId)

      return {
        ...i,
        statistics: statisticItem ? statisticItem.statistics : null,
      }
    })
  }

  public async index(origin: Origin) {
    if (!origin.config.apiToken || origin.config.apiToken === '123') {
      return []
    }

    const Video = (await import('App/Models/Video')).default

    const items = await this.getVideos({
      part: 'snippet',
      type: 'video',
      key: origin.config.apiToken,
      channelId: origin.config.channelId,
    })

    const videos = this.serializeVideosResponse(origin, items)

    await Video.updateOrCreateMany(
      'id',
      videos.map((i) => ({
        id: `${origin.id}-${i.videoId}`,
        name: i.name,
        src: i.src,
        thumbnailSrc: i.thumbSrc,
        videoId: i.videoId,
        originId: origin.id,
        originData: i,
      }))
    )

    return videos
  }
}
