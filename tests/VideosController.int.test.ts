import test from 'japa'
import fs from 'fs'
import Content from 'App/Services/ContentService'

import { createClient } from './fixtures/client'
import Video from 'App/Models/Video'
import { createFakeVideo } from './fixtures/create-fake-file'
import { VideoFactory } from 'Database/factories'
import Image from 'App/Models/Image'

test.group('VideosController (int)', (group) => {
  const client = createClient()
  let filename: string

  group.before(async () => {
    filename = await createFakeVideo('fake-video.mp4')
  })

  group.beforeEach(async () => {
    if (!client.isAuthenticated()) {
      await client.login()
    }

    const videos = await Video.all()

    await Promise.all(videos.map(async (v) => v.delete()))

    const files = await fs.promises.readdir(Content.makePath('uploads'))

    await Promise.all(files.map((file) => fs.promises.rm(Content.makePath('uploads', file))))
  })

  test('[index] should return a list of videos', async (assert) => {
    await VideoFactory.createMany(5)

    const videos = await Video.query().preload('permission')

    const { body } = await client.get('/api/v1/videos')

    assert.deepEqual(
      body.data,
      videos.map((video) => video.serialize())
    )
  })

  test('[show] should return a video by id', async (assert) => {
    const video = await VideoFactory.create()

    await video.load('permission')

    await video.refresh()

    const { body } = await client.get(`/api/v1/videos/${video.id}`)

    assert.deepEqual(body, video.serialize())
  })

  test('[store] should create a video', async (assert) => {
    const { title, src, description, slug } = await VideoFactory.make()

    const payload = {
      title,
      src,
      slug,
      description,
      publishedAt: '2021-01-01 00:00:00',
    }

    await client.post('/api/v1/videos').send(payload)

    const video = await Video.query().first()

    if (!video) {
      assert.fail('Video should be created')
      return
    }

    Object.keys(payload)
      .filter((key) => key !== 'publishedAt')
      .forEach((key) => {
        assert.equal(payload[key], video[key])
      })
  })

  test('[store] should upload a video file', async (assert) => {
    const { title, description, slug, publishedAt } = await VideoFactory.make()

    await client
      .post('/api/v1/videos/upload')
      .field('title', title)
      .field('slug', slug)
      .field('description', description)
      .field('publishedAt', publishedAt.toFormat('yyyy-MM-dd HH:mm:ss'))
      .attach('file', filename)
      .expect(200)

    await new Promise((resolve) => setTimeout(resolve, 500))

    const files = await fs.promises.readdir(Content.makePath('uploads'))

    assert.equal(files.length, 1)
  })

  test('[update] should update a video', async (assert) => {
    const { id } = await VideoFactory.create()

    const title = 'New title'

    await client.patch(`/api/v1/videos/${id}`).send({ title })

    const video = await Video.findOrFail(id)

    assert.deepEqual(video.title, title)
  })

  test('[update] should trigger a error if video was not found', async () => {
    await client.patch('/api/v1/videos/1').send({ title: 'New title' }).expect(404)
  })

  test('[destroy] should delete a video', async (assert) => {
    const { id } = await VideoFactory.create()

    await client.delete(`/api/v1/videos/${id}`)

    const video = await Video.find(id)

    assert.isNull(video)
  })

  test('[destroy] should trigger a error if video was not found', async () => {
    await client.delete('/api/v1/videos/1').expect(404)
  })

  test('[destroy] should also delete related images of video', async (assert) => {
    const { id } = await VideoFactory.with('images', 1).create()

    await client.delete(`/api/v1/videos/${id}`)

    const images = await Image.all()

    assert.equal(images.length, 0)
  })

  test('[destroy] should remove a video file when video is deleted', async (assert) => {
    const { title, description, slug, publishedAt } = await VideoFactory.make()

    const { body } = await client
      .post('/api/v1/videos/upload')
      .field('title', title)
      .field('slug', slug)
      .field('description', description)
      .field('publishedAt', publishedAt.toFormat('yyyy-MM-dd HH:mm:ss'))
      .attach('file', filename)
      .expect(200)

    const video = await Video.findOrFail(body.id)

    await video.delete()

    const files = await fs.promises.readdir(Content.makePath('uploads'))

    assert.equal(files.length, 0)
  })

  test('[embed] should trigger a error when try embed a video that is not local', async (assert) => {
    const video = await VideoFactory.create()

    const { body } = await client.get(`/api/v1/videos/embed/${video.id}`).expect(400)

    assert.equal(body.message, 'Only local videos can be embedded')
  })
})
