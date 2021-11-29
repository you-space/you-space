import fs from 'fs'
import faker from 'faker'

import { listFolder } from 'App/Helpers'
import Content from 'App/Services/ContentService'
import test from 'japa'
import { createClient } from './fixtures/client'

async function createFakePlugin(name: string) {
  const path = Content.makePath('plugins', name)
  const configFile = Content.makePath('plugins', name, 'space.config.json')

  const config = {
    name: name,
  }

  await fs.promises.mkdir(path, { recursive: true })

  await fs.promises.writeFile(configFile, JSON.stringify(config, null, 2))
}

test.group('PluginsController (int)', (group) => {
  group.timeout(10000)

  const client = createClient()

  group.beforeEach(async () => {
    if (!client.isAuthenticated()) {
      await client.login()
    }

    const plugins = await listFolder(Content.makePath('plugins'))

    await Promise.all(
      plugins.map((name) =>
        fs.promises.rmdir(Content.makePath('plugins', name), { recursive: true })
      )
    )
  })

  test('should return a list of plugins', async (assert) => {
    const name = faker.random.word()
    await createFakePlugin(name)

    const { body } = await client.get('/api/v1/plugins')

    const expected = {
      data: [
        {
          id: name,
          name: name,
          description: '',
          active: false,
        },
      ],
    }

    assert.deepEqual(body, expected)
  })

  test('should add a new plugin', async (assert) => {
    const gitUrl = 'https://github.com/you-space/youtube-theme.git'

    await client.post('/api/v1/plugins').send({ gitUrl }).expect(200)

    const { body } = await client.get('/api/v1/plugins')

    const expected = {
      data: [
        {
          id: 'youtube-theme',
          name: 'youtube-theme',
          description: '',
          active: false,
        },
      ],
    }

    assert.deepEqual(body, expected)
  })

  test('should trigger a error if is a invalid url', async (assert) => {
    const { body } = await client
      .post('/api/v1/plugins')
      .send({ gitUrl: 'invalid-url' })
      .expect(422)

    assert.deepEqual(body.message, 'Validation failure')
  })

  test('should activate a plugin', async (assert) => {
    const name = faker.random.word().toLowerCase()

    await createFakePlugin(name)

    await client.patch(`/api/v1/plugins/${name}`).send({ active: true }).expect(200)

    const { body } = await client.get('/api/v1/plugins')

    const expected = {
      data: [
        {
          id: name,
          name: name,
          description: '',
          active: true,
        },
      ],
    }

    assert.deepEqual(body, expected)
  })

  test('should delete a plugin', async (assert) => {
    const name = faker.random.word().toLowerCase()

    await createFakePlugin(name)

    await client.delete(`/api/v1/plugins/${name}`).expect(200)

    const { body } = await client.get('/api/v1/plugins')

    const expected = {
      data: [],
    }

    assert.deepEqual(body, expected)
  })
})
