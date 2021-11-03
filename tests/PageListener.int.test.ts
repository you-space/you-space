import test from 'japa'
import fs from 'fs'

import Drive from '@ioc:Adonis/Core/Drive'
import Content from 'App/Services/ContentService'
import Space from 'App/Services/SpaceService'
import SystemMeta from 'App/Models/SystemMeta'
import { Page } from 'App/Listeners/PageListener'

test.group('PageListener (int)', (group) => {
  const pages = [
    {
      title: 'teste',
      path: 'teste.js',
    },
  ]

  const json = JSON.stringify({ dashboard: { pages } })

  const filename = Content.makePath('themes', 'test-theme', 'space.config.json')

  group.before(async () => {
    await Drive.put(filename, json)
    await SystemMeta.updateOrCreateMetaArray('themes:active', ['test-theme'])
  })
  group.after(async () => {
    await fs.promises.rmdir(Content.makePath('themes', 'test-theme'), { recursive: true })
    await SystemMeta.query().delete()
  })

  test('[page:index] should return a list of pages', async (assert) => {
    const result = await Space.emit<Page[]>('page:index')

    assert.deepEqual(result, [
      {
        id: 0,
        title: 'teste',
        filename: Content.makePath('themes', 'test-theme', 'teste.js'),
      },
    ])
  })
  test('[page:show] should return a page by id', async (assert) => {
    const result = await Space.emit<Page>('page:show', 0)

    assert.deepEqual(result, {
      id: 0,
      title: 'teste',
      filename: Content.makePath('themes', 'test-theme', 'teste.js'),
    })
  })
})
