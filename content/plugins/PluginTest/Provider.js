const axios = require('axios')
const lodash = require('lodash')

class Provider {
    static options = ['import']
    static entityName = 'video-youtube'
    static fields = [
        {
            name: 'apiKey',
            label: 'Api key'
        },
        {
            name: 'channelId',
            label: 'Channel id'
        },
    ]


    config
    maxResults = 50    
    api = axios.create({
        baseURL: 'https://www.googleapis.com/youtube/v3',
    })

    videos = []

    async getUploadPlaylistId() {    
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
    
        return uploadPlaylistId
      }

      async import() {
        await this.fetchVideos()

        await this.service.createMany(this.videos)

        return this.videos
      }

      async fetchVideos(pageToken) {
        const playlistId = await this.getUploadPlaylistId()
    
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
        
        const nextPageToken = lodash.get(requestPlaylistItems, 'data.nextPageToken', null)
    
        const videoIds = items
          .map((i) => lodash.get(i, 'contentDetails.videoId', null))
          .filter((i) => i !== null)
    
        const requestVideos = await this.api.get('videos', {
          params: {
            key: this.config.apiKey,
            part: 'statistics, snippet',
            id: videoIds.join(),
          },
        })
    
        const videos = lodash.get(requestVideos, 'data.items', [])
        const data = videos.map((i) => ({
            id: i.id,
            data: i,
        }))

        this.videos = this.videos.concat(data)

        if (nextPageToken) {
            // await this.fetchVideos(nextPageToken)
        }
      }

      serialize(data){
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

module.exports = Provider