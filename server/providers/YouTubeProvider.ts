import { ApplicationContract } from '@ioc:Adonis/Core/Application'
import axios, { AxiosInstance, AxiosRequestConfig, AxiosResponse } from 'axios'
import Origin from 'App/Models/Origin'
import lodash from 'lodash'

export interface OriginProviderMeta {
  totalVideos: number
}

export interface OriginProviderVideo {
  name: string
  videoId: string
  thumbnailSrc: string
  src: string
  originId: number
  viewsCount: number
}

export interface OriginProvideResponse {
  meta: OriginProviderMeta
  videos: OriginProviderVideo[]
}

export interface YouTubeSearchParams {
  key: string
  part: string
  [prop: string]: any
}

export default class YouTubeProvider {
  public static needsApplication = true
  public apiUrl = 'https://www.googleapis.com/youtube/v3'
  public axios: AxiosInstance

  constructor(protected application: ApplicationContract) {
    this.axios = axios.create({
      baseURL: this.apiUrl,
    })
  }

  public register() {
    this.application.container.singleton('Providers/YouTube', () => this)
  }

  public async invoke<T extends {}>(path: string, config: AxiosRequestConfig): Promise<any> {
    try {
      console.log(`[you-tube-provider] request ${path}`)

      return await this.axios.get<T>(path, {
        params: config.params,
      })
    } catch (error) {
      if (error.response) {
        console.log('[you-tube-provider] error')
        console.log('[you-tube-provider] status', error.response.status)
        console.log(error.response.data)
      } else if (error.request) {
        console.log('[you-tube-provider] route not found')
        console.log(`${error.config.baseURL}/${error.config.url}`)
      } else {
        console.log('Error', error.message)
      }
      return null
    }
  }

  public async finChannelDetails(apiKey: string, channelId: string) {
    const request = await this.invoke('channels', {
      params: {
        key: apiKey,
        id: channelId,
        part: 'contentDetails',
      },
    })

    const channel = lodash.get(request, 'data.items[0]', null)

    if (!channel) {
      throw new Error('[you-tube-provider] channel not found')
    }

    return channel
  }

  public async getPlaylistItemsWithStatistics(key: string, playlistId: string, pageToken?: string) {
    const request = await this.invoke<any>('playlistItems', {
      params: {
        part: 'contentDetails',
        key,
        playlistId,
        pageToken,
        maxResults: 50,
      },
    })

    const items = lodash.get(request, 'data.items', [])
    const totalVideos = lodash.get(request, 'data.pageInfo.totalResults', 0)
    const nextPageToken = lodash.get(request, 'data.nextPageToken', null)
    const prevPageToken = lodash.get(request, 'data.prevPageToken', null)

    const videoIds = items
      .map((i) => lodash.get(i, 'contentDetails.videoId', null))
      .filter((i) => i !== null)

    const requestVideos = await this.invoke('videos', {
      params: {
        key,
        part: 'statistics, snippet',
        id: videoIds.join(),
      },
    })

    const videos = lodash.get(requestVideos, 'data.items', [])

    return {
      videos,
      totalVideos,
      nextPageToken,
      prevPageToken,
    }
  }

  public async registerOriginVideosByPage(
    origin: Origin,
    page = 1
  ): Promise<OriginProvideResponse> {
    const redis = (await import('@ioc:Adonis/Addons/Redis')).default
    const View = (await import('App/Models/View')).default
    const Video = (await import('App/Models/Video')).default

    const mainRedisKey = `origins:${origin.id}:provider`

    const cacheKeys = {
      pageItems: `${mainRedisKey}:pages:${page}:items`,
      totalVideos: `${mainRedisKey}:totalVideos`,
      currentPageToken: `${mainRedisKey}:pages:${page}:pageToken`,
      nextPageToken: `${mainRedisKey}:pages:${page + 1}:pageToken`,
      prevPageToken: `${mainRedisKey}:pages:${page - 1}:pageToken`,
    }

    const cacheItems = await redis.get(cacheKeys.pageItems)
    const cacheTotalVideos = await redis.get(cacheKeys.totalVideos)

    if (cacheItems) {
      const videos = JSON.parse(cacheItems)
      return {
        videos: this.serializeYoutubeVideos(origin, videos),
        meta: {
          totalVideos: Number(cacheTotalVideos) || 0,
        },
      }
    }

    let pageToken = await redis.get(cacheKeys.currentPageToken)

    if (page > 1 && !pageToken) {
      throw new Error('[youtube-provider] page still not registered')
    }

    const request = await this.getPlaylistItemsWithStatistics(
      origin.config.apiToken,
      origin.config.uploadPlaylistId,
      pageToken || undefined
    )

    await redis.set(cacheKeys.totalVideos, request.totalVideos)
    await redis.set(cacheKeys.pageItems, JSON.stringify(request.videos))

    await redis.set(cacheKeys.nextPageToken, request.nextPageToken)

    if (request.prevPageToken) {
      await redis.set(cacheKeys.prevPageToken, request.prevPageToken)
    }

    const serializedVideos = this.serializeYoutubeVideos(origin, request.videos)

    await Video.updateOrCreateMany(
      'id',
      serializedVideos.map((i) => ({
        id: `${origin.id}-${i.videoId}`,
        name: i.name,
        src: i.src,
        thumbnailSrc: i.thumbnailSrc,
        videoId: i.videoId,
        originId: origin.id,
        originData: request.videos.find((v) => v.id === i.videoId),
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

    return {
      meta: {
        totalVideos: Number(request.totalVideos) || 0,
      },
      videos: this.serializeYoutubeVideos(origin, request.videos),
    }
  }

  public serializeYoutubeVideos(origin: Origin, items: any[]): OriginProviderVideo[] {
    return items.map((i) => ({
      name: lodash.get(i, 'snippet.title', null),
      videoId: lodash.get(i, 'id', null),
      src: `https://www.youtube.com/embed/${lodash.get(i, 'id', null)}`,
      thumbnailSrc:
        lodash.get(i, 'snippet.thumbnails.standard.url', null) ||
        lodash.get(i, 'snippet.thumbnails.default.url', null),
      originId: origin.id,
      viewsCount: lodash.get(i, 'statistics.viewCount'),
    }))
  }
}
