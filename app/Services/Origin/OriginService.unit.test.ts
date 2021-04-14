import Origin, { OriginTypes } from 'App/Models/Origin'
import test from 'japa'
import OriginService from './OriginService'

test.group('OriginService (unit)', () => {
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

  test.group('errorHandler()', (group) => {
    group.beforeEach(givenOrigin)
    group.afterEach(deleteOrigin)
    test('need test', () => {
      throw new Error('need tests')
    })
  })

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
})
