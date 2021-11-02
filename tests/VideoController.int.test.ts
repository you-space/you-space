import test from 'japa'
import fs from 'fs'
import Content from 'App/Services/ContentService'

import { createClient } from './fixtures/client'
import Video from 'App/Models/Video'
import { createFakeVideo } from './fixtures/create-fake-file'
import { VideoFactory } from 'Database/factories'

test.group('VideoController (int)', (group) => {
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

    await Promise.all(videos.map(async (image) => image.delete()))

    const files = await fs.promises.readdir(Content.makePath('uploads'))

    await Promise.all(files.map((file) => fs.promises.rm(Content.makePath('uploads', file))))
  })

  test('should upload a video file', async (assert) => {
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

  test('should remove a video file when video is deleted', async (assert) => {
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

  test('should trigger a error when try embed a video that is not local', async (assert) => {
    const video = await VideoFactory.create()

    const { body } = await client.get(`/api/v1/videos/embed/${video.id}`).expect(400)

    assert.equal(body.message, 'Only local videos can be embedded')
  })
})
