import Origin, { OriginTypes } from 'App/Models/Origin'
import test from 'japa'
import OriginService from 'App/Services/Origin/OriginService'

test.group('OriginService (integration)', () => {
  const service = new OriginService()
  let origin: Origin

  async function givenOrigin() {
    origin = new Origin()
    origin.type = OriginTypes.YouTube
    origin.name = 'Test origin'
    origin.config = {
      apiKey: process.env.TEST_YOUTUBE_API_KEY as string,
      channelId: process.env.TEST_YOUTUBE_CHANNEL_ID as string,
    }

    await origin.save()
  }

  async function deleteOrigin() {
    await origin.delete()
  }

  test.group('getProvider()', (group) => {
    group.beforeEach(givenOrigin)
    group.afterEach(deleteOrigin)

    test('should return provider with metadata ', (assert) => {
      const provider = service.getProvider(origin)
      assert.isDefined(provider.metadata)
      assert.hasAllKeys(provider.metadata, ['get', 'set'])
    })

    test('should return provider with origin config', (assert) => {
      const provider = service.getProvider(origin)
      assert.isDefined(provider.config)
      assert.deepStrictEqual(provider.config, origin.config)
    })

    test('should trigger a error if is not a available provider', (assert) => {
      try {
        origin.type = 'fake-type'
        service.getProvider(origin)
      } catch (error) {
        assert.equal(error.message, 'provider not found')
      }
    })
  })

  test.group('importVideos()', (group) => {
    group.beforeEach(givenOrigin)
    group.afterEach(deleteOrigin)

    test('should create videos returned from provider', async (assert) => {
      await service.importVideos(origin, 1)
      const { count } = await origin.related('videos').query().count('*').firstOrFail()

      assert.equal(count, 50)
    })

    test('should create views of videos returned from provider', async (assert) => {
      await service.importVideos(origin, 1)
      const { count } = await origin.related('views').query().count('*').firstOrFail()

      assert.equal(count, 50)
    })
  })

  test.group('importComments()', (group) => {
    group.beforeEach(givenOrigin)
    group.afterEach(deleteOrigin)

    test('should create comments returned from provider', async (assert) => {
      await service.importVideos(origin, 1)

      const video = await origin.related('videos').query().limit(1).firstOrFail()

      await service.importComments(origin, video.videoId, 1)

      const { count } = await origin
        .related('comments')
        .query()
        .whereNull('parentCommentId')
        .count('*')
        .firstOrFail()

      assert.equal(count, 50)
    })
  })
})
