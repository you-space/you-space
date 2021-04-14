import test from 'japa'
import YoutubeProvider from 'App/Services/Origin/YouTubeProvider'
import faker from 'faker'

test.group('YoutubeProvider (integration)', () => {
  let provider: YoutubeProvider

  function givenProvider() {
    provider = new YoutubeProvider()
    let metadata = {}

    provider.metadata = {
      get: async () => metadata,
      set: async (value) => (metadata = value),
    }

    provider.config = {
      apiKey: process.env.TEST_YOUTUBE_API_KEY,
      channelId: process.env.TEST_YOUTUBE_CHANNEL_ID,
    }
  }

  test.group('getUploadPlaylistId()', (group) => {
    group.beforeEach(givenProvider)
    test('should trigger a error if not find channel', async (asset) => {
      provider.config.channelId = undefined

      await provider.getUploadPlaylistId().catch((err) => {
        asset.equal(err.message, 'you-tube channel not found')
      })
    })
  })

  test.group('fetchVideos', (group) => {
    group.beforeEach(givenProvider)

    test('should return you-tube videos of the channel', async (assert) => {
      const videos = await provider.fetchVideos(1)

      videos.forEach((v) => {
        assert.typeOf(v.videoId, 'string')
        assert.typeOf(v.data, 'object')
      })
    })

    test('should trigger error if do not have a page-token of page', async (assert) => {
      await provider.fetchVideos(10).catch((error) => {
        assert.equal(error.message, 'page token not found')
      })
    })
  })

  test.group('serializeVideos', (group) => {
    group.beforeEach(givenProvider)

    test('should return formated video', (assert) => {
      const videoId = faker.random.uuid()

      const video = {
        videoId,
        title: faker.name.title(),
        src: `https://www.youtube.com/embed/${videoId}`,
        description: faker.lorem.words(40),
        viewsCount: faker.random.number({ min: 0 }),
        thumbnailSrc: faker.random.image(),
        originLink: `https://www.youtube.com/watch?v=${videoId}`,
        publishedAt: faker.date.past().toISOString(),
      }

      const data = {
        id: videoId,
        snippet: {
          title: video.title,
          description: video.description,
          thumbnails: {
            standard: { url: video.thumbnailSrc },
          },
          publishedAt: video.publishedAt,
        },
        statistics: {
          viewCount: video.viewsCount,
        },
      }

      assert.deepStrictEqual(video, provider.serializeVideo(data))
    })
  })
})
