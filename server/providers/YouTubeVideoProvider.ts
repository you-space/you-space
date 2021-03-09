import { ApplicationContract } from '@ioc:Adonis/Core/Application'
import { URLSearchParams } from 'url'
import axios, { AxiosInstance } from 'axios'

import Origin from 'App/Models/Origin'

export interface YouTubeProvider {
  videos: {
    index(origin: Origin): Promise<any[]>
    show(origin: Origin, videoId: string): Promise<any[]>
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
          show: this.show.bind(this),
        },
      })
    )
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
    const { data: searchData } = await this.axios.get<any>('search', {
      params: params,
    })

    const videos = searchData.items.filter((i) => i.id.kind === 'youtube#video')

    const videoIds = searchData.items.map((i) => i.id.videoId)

    const { data: statisticsData } = await this.axios.get<any>('videos', {
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

  public async show(origin: Origin, videoId) {
    try {
      const { data } = await this.axios.get<any>('videos', {
        params: {
          part: 'snippet, statistics',
          key: origin.config.apiToken,
          channelId: origin.config.channelId,
          id: videoId,
        },
      })

      const [video] = this.serializeVideosResponse(origin, data.items)

      return video
    } catch (error) {
      console.log(error)
      return null
    }
  }

  public async index(origin: Origin) {
    if (!origin.config.apiToken || origin.config.apiToken === '123') {
      return []
    }

    try {
      const items = await this.getVideos({
        part: 'snippet',
        type: 'snippet',
        key: origin.config.apiToken,
        channelId: origin.config.channelId,
      })

      return this.serializeVideosResponse(origin, items)
    } catch (error) {
      console.log(error.response.data)
      return []
    }
  }
}
