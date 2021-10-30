import test from 'japa'
import fs from 'fs'
import Content from 'App/Services/ContentService'
import Image from 'App/Models/Image'

import { createClient } from './fixtures/client'
import { createFakeImage } from './fixtures/create-fake-file'

test.group('ImageController (int)', (group) => {
  const client = createClient()
  let filename: string

  group.before(async () => {
    filename = await createFakeImage('fake-image.png')
  })

  group.beforeEach(async () => {
    if (!client.isAuthenticated()) {
      await client.login()
    }

    const images = await Image.all()

    await Promise.all(images.map(async (image) => image.delete()))
  })

  test('should upload a image', async (assert) => {
    await client.post('/api/v1/images/upload').attach('file', filename).expect(200)

    const files = await fs.promises.readdir(Content.makePath('uploads'))

    assert.equal(files.length, 1)
  })

  test('should remove image file when delete a local image ', async (assert) => {
    const { body } = await client.post('/api/v1/images/upload').attach('file', filename)

    const image = await Image.findOrFail(body.id)

    await image.delete()

    const files = await fs.promises.readdir(Content.makePath('uploads'))

    assert.equal(files.length, 0)
  })

  test('should trigger a error when try embed a image that is not local', async (assert) => {
    assert.plan(1)

    const image = await Image.create({
      source: 'youtube',
      src: 'https://i.ytimg.com/vi/gEOa793e_dU/hqdefault.jpg',
    })

    const { body } = await client.get(`/api/v1/images/embed/${image.id}`).expect(400)

    assert.equal(body.message, 'Only local images can be embedded')
  })
})
