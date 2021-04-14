import lodash from 'lodash'

import { OriginProvider, OriginProviderMetadata, OriginVideo } from '../types'
import axios from 'axios'

export default class YouTubeProvider implements OriginProvider {
  public config: any

  public metadata: OriginProviderMetadata

  public api = axios.create({
    baseURL: 'https://www.googleapis.com/youtube/v3',
  })

  public async getUploadPlaylistId() {
    const metadata = await this.metadata.get()

    if (metadata.uploadPlaylistId) {
      return metadata.uploadPlaylistId
    }

    const request = await this.api
      .get('channels', {
        params: {
          key: this.config.apiKey,
          id: this.config.channelId,
          part: 'contentDetails',
        },
      })
      .catch(() => {})

    const channel = lodash.get(request, 'data.items[0]', null)

    if (!channel) {
      throw new Error('you-tube channel not found')
    }

    const uploadPlaylistId = lodash.get(channel, 'contentDetails.relatedPlaylists.uploads')

    await this.metadata.set({
      ...metadata,
      uploadPlaylistId,
    })

    return uploadPlaylistId
  }

  public async fetchVideos(page: number): Promise<OriginVideo[]> {
    const maxResults = 50
    const metadata = await this.metadata.get()
    const playlistId = await this.getUploadPlaylistId()

    const pageToken = lodash.get(metadata, `pageTokens.${page}`, undefined)

    if (page > 1 && !pageToken) {
      throw new Error('page token not found')
    }

    const requestPlaylistItems = await this.api.get('playlistItems', {
      params: {
        part: 'contentDetails',
        key: this.config.apiKey,
        playlistId,
        pageToken,
        maxResults: maxResults,
      },
    })

    const items = lodash.get(requestPlaylistItems, 'data.items', [])

    const totalVideos = lodash.get(requestPlaylistItems, 'data.pageInfo.totalResults', 0)
    const nextPageToken = lodash.get(requestPlaylistItems, 'data.nextPageToken', null)
    const prevPageToken = lodash.get(requestPlaylistItems, 'data.prevPageToken', null)

    await this.metadata.set({
      totalVideos,
      pageTokens: {
        ...metadata.pageTokens,
        [page - 1]: prevPageToken,
        [page + 1]: nextPageToken,
      },
    })

    const videoIds = items
      .map((i: any) => lodash.get(i, 'contentDetails.videoId', null))
      .filter((i: any) => i !== null)

    const requestVideos = await this.api.get('videos', {
      params: {
        key: this.config.apiKey,
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

  public serializeVideo(data: any) {
    const viewsCount = lodash.get(data, 'statistics.viewCount', 0)
    const standardThumb = lodash.get(data, 'snippet.thumbnails.standard.url', null)
    const defaultThumb = lodash.get(data, 'snippet.thumbnails.default.url', null)
    return {
      videoId: lodash.get(data, 'id', null),
      title: lodash.get(data, 'snippet.title', null),
      src: `https://www.youtube.com/embed/${lodash.get(data, 'id', null)}`,
      description: lodash.get(data, 'snippet.description', null),
      viewsCount: Number(viewsCount),
      thumbnailSrc: standardThumb || defaultThumb,
      originLink: `https://www.youtube.com/watch?v=${lodash.get(data, 'id', null)}`,
      publishedAt: lodash.get(data, 'snippet.publishedAt', null),
    }
  }
}
