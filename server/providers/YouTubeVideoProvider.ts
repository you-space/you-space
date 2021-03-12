import { ApplicationContract } from '@ioc:Adonis/Core/Application'
import axios, { AxiosInstance, AxiosResponse } from 'axios'
import Origin from 'App/Models/Origin'

export interface VideoIndexResponse {
  pageInfo: {
    totalResults: number | string
  }
  videos: any[]
}

export interface YouTubeProvider {
  videos: {
    index(origin: Origin, page?: number): Promise<any>
    registerOriginVideosByPage(origin: Origin, page?: number): Promise<VideoIndexResponse>
  }
}

export interface YouTubeSearchParams {
  key: string
  part: string
  [prop: string]: any
}

export default class YouTubeVideoProvider {
  public static needsApplication = true
  public apiUrl = '' // 'https://www.googleapis.com/youtube/v3'
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
          registerOriginVideosByPage: this.registerOriginVideosByPage.bind(this),
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
      if (error.response) {
        console.log(error.response.data)
      }
      return null
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
    const search = await this.invoke<any>('search', {
      params: params,
    })

    if (!search) {
      console.error('[you-tube-api] unvaliable')
      return {
        videos: [],
        pageInfo: null,
      }
    }

    const { data: searchData } = search

    const videos = searchData.items.filter((i) => i.id.kind === 'youtube#video')

    const videoIds = searchData.items.map((i) => i.id.videoId)

    const { data: statisticsData } = await this.invoke('videos', {
      params: {
        key: params.key,
        part: 'statistics',
        id: videoIds.join(),
      },
    })

    const videosWithStatistic = videos.map((i) => {
      const statisticItem = statisticsData.items.find((s) => s.id === i.id.videoId)

      return {
        ...i,
        statistics: statisticItem ? statisticItem.statistics : null,
      }
    })

    return {
      videos: videosWithStatistic,
      pageInfo: {
        ...searchData.pageInfo,
        nextPageToken: searchData.nextPageToken,
        prevPageToken: searchData.prevPageToken,
      },
    }
  }

  public async registerOriginVideosByPage(origin: Origin, page = 1): Promise<VideoIndexResponse> {
    const redis = (await import('@ioc:Adonis/Addons/Redis')).default
    const Video = (await import('App/Models/Video')).default
    const index = await this.index(origin, page)
    if (!index.pageInfo) {
      const totalItems = await redis.get(`origin:${origin.id}:totalItems`)
      return {
        videos: index.videos,
        pageInfo: {
          totalResults: totalItems || 0,
        },
      }
    }

    return {
      videos: index.videos,
      pageInfo: index.pageInfo,
    }
  }

  public async index(origin: Origin, page = 1): Promise<VideoIndexResponse> {
    if (!origin.config.apiToken) {
      throw new Error('invalid config')
    }

    const redis = (await import('@ioc:Adonis/Addons/Redis')).default
    const Video = (await import('App/Models/Video')).default

    let pageToken

    if (page > 1) {
      pageToken = await redis.get(`origin:${origin.id}:pages:${page}`)
    }

    const { videos, pageInfo } = await this.getVideos({
      part: 'snippet',
      type: 'video',
      key: origin.config.apiToken,
      channelId: origin.config.channelId,
      pageToken,
    })

    const nextPage = page + 1
    const prevPage = page - 1

    if (pageInfo) {
      await redis.set(`origin:${origin.id}:pages:${nextPage}`, pageInfo.nextPageToken)

      if (prevPage && pageInfo.prevPageToken) {
        await redis.set(`origin:${origin.id}:pages:${prevPage}`, pageInfo.prevPageToken)
      }

      await redis.set(`origin:${origin.id}:totalItems`, pageInfo.totalResults)
    }

    const serializedVideos = this.serializeVideosResponse(origin, videos)

    await Video.updateOrCreateMany(
      'id',
      serializedVideos.map((i) => ({
        id: `${origin.id}-${i.videoId}`,
        name: i.name,
        src: i.src,
        thumbnailSrc: i.thumbSrc,
        videoId: i.videoId,
        originId: origin.id,
        originData: i,
      }))
    )

    return {
      videos: serializedVideos,
      pageInfo,
    }
  }
}
