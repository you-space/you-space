import lodash from 'lodash'
import axios, { AxiosInstance } from 'axios'
import { OriginVideoProvider } from './types'
import { OriginHelper } from './helpers'
import { OriginConfig } from 'App/Models/Origin'

const api = axios.create({
  baseURL: 'https://www.googleapis.com/youtube/v3',
})

export default class YoutubeProvider extends OriginHelper implements OriginVideoProvider {
  public static async checkConfig(config: OriginConfig) {
    const request = await api.get('channels', {
      params: {
        key: config.apiKey,
        id: config.channelId,
        part: 'contentDetails',
      },
    })

    const channel = lodash.get(request, 'data.items[0]', null)

    if (!channel) {
      throw new Error('[you-tube-provider] channel not found')
    }

    return channel
  }

  public async preload(config: OriginConfig) {
    const metadata = await this.getMetadata()
    if (metadata.uploadPlaylistId) {
      return
    }

    const request = await api.get('channels', {
      params: {
        key: config.apiKey,
        id: config.channelId,
        part: 'contentDetails',
      },
    })

    const channel = lodash.get(request, 'data.items[0]', null)

    if (!channel) {
      throw new Error('[you-tube-provider] channel not found')
    }
    const uploadPlaylistId = lodash.get(channel, 'contentDetails.relatedPlaylists.uploads')

    await this.saveMetadata({
      ...metadata,
      uploadPlaylistId,
    })
  }

  public async getVideos(page: number) {
    const { config } = this.origin
    const metadata = await this.getMetadata()
    let pageToken

    if (page > 1) {
      pageToken = metadata.pageTokens[page]
    }

    if (page > 1 && !pageToken) {
      console.log(pageToken, metadata)
      throw new Error('page token not found')
    }

    const request = await api.get('playlistItems', {
      params: {
        part: 'contentDetails',
        key: config.apiKey,
        playlistId: metadata.uploadPlaylistId,
        pageToken,
        maxResults: 50,
      },
    })

    const items = lodash.get(request, 'data.items', [])

    const totalVideos = lodash.get(request, 'data.pageInfo.totalResults', 0)
    const nextPageToken = lodash.get(request, 'data.nextPageToken', null)
    const prevPageToken = lodash.get(request, 'data.prevPageToken', null)

    await this.saveMetadata({
      ...metadata,
      totalVideos,
      pageTokens: {
        ...metadata.pageTokens,
        [page - 1]: prevPageToken,
        [page + 1]: nextPageToken,
      },
    })

    const videoIds = items
      .map((i) => lodash.get(i, 'contentDetails.videoId', null))
      .filter((i) => i !== null)

    const requestVideos = await api.get('videos', {
      params: {
        key: config.apiKey,
        part: 'statistics, snippet',
        id: videoIds.join(),
      },
    })

    const videos = lodash.get(requestVideos, 'data.items', [])

    return videos.map((i) => ({
      videoId: i.id,
      data: i,
    }))
  }

  public async getTotalVideos() {
    let metadata = await this.getMetadata()
    if (!metadata.totalVideos) {
      await this.getVideos(1)
      metadata = await this.getMetadata()
    }
    return metadata.totalVideos || 0
  }

  public serializeVideo(data: any) {
    const viewsCount = lodash.get(data, 'statistics.viewCount', 0)
    const standardThumb = lodash.get(data, 'snippet.thumbnails.standard.url', null)
    const defaultThumb = lodash.get(data, 'snippet.thumbnails.default.url', null)
    return {
      videoId: lodash.get(data, 'id', null),
      name: lodash.get(data, 'snippet.title', null),
      src: `https://www.youtube.com/embed/${lodash.get(data, 'id', null)}`,
      description: lodash.get(data, 'snippet.description', null),
      viewsCount: Number(viewsCount),
      thumbnailSrc: standardThumb || defaultThumb,
    }
  }
}
