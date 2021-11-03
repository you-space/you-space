import Content from 'App/Services/ContentService'
import Space from 'App/Services/SpaceService'
import test from 'japa'
import fs from 'fs'
import faker from 'faker'
import { listFolder } from 'App/Helpers'
import { string } from '@ioc:Adonis/Core/Helpers'
import SystemMeta from 'App/Models/SystemMeta'
import { Theme } from 'App/Listeners/ThemeListener'

async function createFakeTheme(name: string) {
  const path = Content.makePath('themes', name)

  await fs.promises.mkdir(path, { recursive: true })
}

test.group('ThemeListener (int)', (group) => {
  group.beforeEach(async () => {
    const themes = await listFolder(Content.makePath('themes'))

    await Promise.all(
      themes.map((theme) =>
        fs.promises.rmdir(Content.makePath('themes', theme), { recursive: true })
      )
    )

    await SystemMeta.query().delete().where('name', 'theme:active')
  })

  test('[theme:index] should return list of themes', async (assert) => {
    const id = string.dashCase(faker.name.title())

    await createFakeTheme(id)

    const themes = await Space.emit<Theme[]>('theme:index')

    if (!themes || !themes[0]) {
      assert.fail('event should return a value')
      return
    }

    assert.equal(themes[0].id, id)
  })

  test('[theme:show] should return a theme by id', async (assert) => {
    const id = string.dashCase(faker.name.title())

    await createFakeTheme(id)

    const theme = await Space.emit<Theme>('theme:show', id)

    if (!theme) {
      assert.fail('event should return a value')
      return
    }

    assert.equal(theme.id, id)
  })

  test('[theme:store] should download a theme', async (assert) => {
    await Space.emit('theme:store', 'https://github.com/you-space/awake-theme.git')

    const theme = await Space.emit<Theme>('theme:show', 'awake-theme')

    if (!theme) {
      assert.fail('event should return a value')
      return
    }

    assert.equal(theme.id, 'awake-theme')
  })

  test('[theme:store] should throw a error when is a invalid git url', async (assert) => {
    assert.plan(1)

    await Space.emit('theme:store', 'invalid').catch((error) =>
      assert.equal(error.message, 'Invalid git url')
    )
  })

  test('[theme:destroy] should delete a theme by name', async (assert) => {
    const name = string.dashCase(faker.name.title())

    await createFakeTheme(name)

    let exist = await Content.exists('themes', name)

    assert.isTrue(exist)

    await Space.emit('theme:destroy', name)

    exist = await Content.exists('themes', name)

    assert.isFalse(exist)
  })

  test('[theme:destroy] should throw a error when theme was not found', async (assert) => {
    assert.plan(1)

    await Space.emit('theme:destroy', 'invalid').catch((err) =>
      assert.equal(err.message, 'Theme not found')
    )
  })
})
