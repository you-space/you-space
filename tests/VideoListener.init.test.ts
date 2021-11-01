import test from 'japa'

import Space from 'App/Services/SpaceService'
import Video from 'App/Models/Video'
import Image from 'App/Models/Image'
import { VideoFactory } from 'Database/factories'

interface IndexResult {
  meta: any
  data: Video[]
}

test.group('VideoListener (int)', (group) => {
  group.beforeEach(async () => {
    const videos = await Video.all()

    await Promise.all(videos.map(async (video) => await video.delete()))
  })

  test('[video:index] should return a list of videos', async (assert) => {
    await VideoFactory.createMany(10)

    const videos = await Video.query().orderBy('created_at', 'asc')

    const result = await Space.emit<IndexResult>('video:index')

    if (!result) {
      assert.fail('Event should return something')
      return
    }

    assert.deepEqual(
      result.data,
      videos.map((video) => video.serialize())
    )
  })

  test('[video:show] should return a video by id', async (assert) => {
    const video = await VideoFactory.create()

    await video.refresh()

    const result = await Space.emit<Video>('video:show', {
      id: video.id,
    })

    if (!result) {
      assert.fail('Event should return something')
      return
    }

    assert.deepEqual(result, video.toJSON())
  })

  test('[video:store] should create a video', async (assert) => {
    const data = await VideoFactory.make()

    await Space.emit<Video>('video:store', data)

    const video = await Video.query().first()

    if (!video) {
      assert.fail('Video should be created')
      return
    }

    assert.deepEqual(video.slug, data.slug)
  })

  test('[video:update] should update a video', async (assert) => {
    const { id } = await VideoFactory.create()

    const title = 'New title'

    await Space.emit<Video>('video:update', {
      id,
      title,
    })

    const video = await Video.findOrFail(id)

    assert.deepEqual(video.title, title)
  })

  test('[video:update] should trigger a error if video was not found', async (assert) => {
    assert.plan(1)
    await Space.emit('video:update', { id: 1 }).catch((err) =>
      assert.equal(err.message, 'E_ROW_NOT_FOUND: Row not found')
    )
  })

  test('[video:destroy] should delete a video', async (assert) => {
    const { id } = await VideoFactory.create()

    await Space.emit('video:destroy', id)

    const video = await Video.find(id)

    assert.isNull(video)
  })

  test('[video:destroy] should trigger a error if video was not found', async (assert) => {
    assert.plan(1)

    await Space.emit('video:destroy', 1).catch((err) =>
      assert.equal(err.message, 'E_ROW_NOT_FOUND: Row not found')
    )
  })

  test('[video:destroy] should also delete related images', async (assert) => {
    const video = await VideoFactory.with('images', 1).create()

    await Space.emit('video:destroy', video.id)

    const images = await Image.all()

    assert.equal(images.length, 0)
  })
})
