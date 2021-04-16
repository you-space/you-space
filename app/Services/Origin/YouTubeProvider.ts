import lodash from 'lodash'

import { OriginProvider, OriginProviderMetadata, OriginVideo } from './types'
import axios from 'axios'

export default class YouTubeProvider implements OriginProvider {
  public config: any

  public metadata: OriginProviderMetadata

  public maxResults = 50

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
        maxResults: this.maxResults,
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

  public async fetchComments(videoId: string, page: number) {
    const metadata = await this.metadata.get()
    let pageToken

    if (page > 1) {
      pageToken = metadata[`${videoId}:comments:${page - 1}`]
    }

    if (page > 1 && !pageToken) {
      return []
    }

    const request = await this.api.get('/commentThreads', {
      params: {
        key: this.config.apiKey,
        part: 'snippet, replies',
        textFormat: 'plainText',
        videoId,
        maxResults: this.maxResults,
      },
    })

    const comments = lodash.get(request, 'data.items', [])
    const nextPageToken = lodash.get(request, 'data.nextPageToken', null)
    const prevPageToken = lodash.get(request, 'data.prevPageToken', null)

    await this.metadata.set({
      ...metadata,
      [`${videoId}:comments:${page - 1}`]: prevPageToken,
      [`${videoId}:comments:${page + 1}`]: nextPageToken,
    })

    return comments.map((c) => {
      const comment = lodash.get(c, 'snippet.topLevelComment', null)
      const replies = lodash.get(c, 'replies.comments', []).map((r) => ({
        commentId: lodash.get(r, 'id', null),
        userId: lodash.get(r, 'snippet.authorChannelId.value', null),
        data: r,
      }))

      return {
        commentId: lodash.get(comment, 'id', null),
        userId: lodash.get(comment, 'snippet.authorChannelId.value', null),
        data: comment,
        replies,
      }
    })
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

  public serializeComment(data: any) {
    return {
      commentId: lodash.get(data, `id`, null),
      parentCommentId: undefined,
      userId: lodash.get(data, `snippet.authorChannelId.value`, null),
      username: lodash.get(data, `snippet.authorDisplayName`, null),
      avatarSrc: lodash.get(data, `snippet.authorProfileImageUrl`, null),
      content: lodash.get(data, `snippet.textDisplay`, null),
      likeCount: lodash.get(data, `snippet.likeCount`, 0),
      unlikeCount: lodash.get(data, `snippet.unlikeCount`, 0),
    }
  }
}
