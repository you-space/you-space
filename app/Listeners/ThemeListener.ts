import fs from 'fs'
import path from 'path'
import { uniq } from 'lodash'
import Application from '@ioc:Adonis/Core/Application'
import Drive from '@ioc:Adonis/Core/Drive'
import SystemMeta from 'App/Models/SystemMeta'
import { isGitUrl } from 'App/Helpers'
import execa from 'execa'

export interface Theme {
  name: string
  filename: string
  active: boolean
}

export default class ThemeListener {
  public async index() {
    const folders = await fs.promises.readdir(Application.makePath('content', 'themes'), {
      withFileTypes: true,
    })

    const active = await SystemMeta.firstOrCreateMetaArray<string>('themes:active')

    return folders
      .filter((f) => f.isDirectory())
      .map((t) => ({
        name: t.name,
        active: active.includes(t.name),
        filename: Application.makePath('content', 'themes', t.name),
      }))
  }

  public async show(name: string) {
    const filename = Application.makePath('content', 'themes', name)

    const active = await SystemMeta.firstOrCreateMetaArray<string>('themes:active')

    const exist = await Drive.exists(filename)

    if (!exist) {
      return null
    }

    return {
      filename,
      name,
      active: active.includes(name),
    }
  }

  public async store(gitUrl: string) {
    const name = path.basename(gitUrl).replace('.git', '')
    const filename = Application.makePath('content', 'themes', name)
    const isValid = await isGitUrl(gitUrl)

    if (!isValid) {
      throw new Error('Repository url invalid')
    }

    const exist = await Drive.exists(filename)

    if (exist) {
      throw new Error('plugin already installed')
    }

    await execa('git', ['clone', gitUrl, filename])
  }

  public async destroy(name: string) {
    const theme = await this.show(name)

    if (!theme) {
      throw new Error('Theme not found')
    }

    if (theme.active) {
      throw new Error('Theme is active')
    }

    await execa('rm', ['-rf', theme.filename])
  }

  public async start(name: string) {
    const theme = await this.show(name)

    if (!theme) {
      throw new Error('Theme not found')
    }

    const { start } = await import(theme.filename)

    if (start) {
      await start()
    }

    const active = await SystemMeta.firstOrCreateMetaArray<string>('themes:active')

    await SystemMeta.updateOrCreateMetaArray('themes:active', uniq([...active, name]))
  }

  public async stop(name: string) {
    const theme = await this.show(name)

    if (!theme) {
      throw new Error('Theme not found')
    }

    const { stop } = await import(theme.filename)

    if (stop) {
      await stop()
    }

    const active = await SystemMeta.firstOrCreateMetaArray<string>('themes:active')

    await SystemMeta.updateOrCreateMetaArray(
      'themes:active',
      active.filter((t) => t !== name)
    )
  }

  public async update({ name, active }: Theme) {
    const theme = await this.show(name)

    if (!theme) {
      throw new Error('Theme not found')
    }

    const activeThemeName = await SystemMeta.firstOrCreateMetaArray<string>('themes:active')

    if (active && activeThemeName[0]) {
      await this.stop(activeThemeName[0])
    }

    if (active) {
      await this.start(theme.name)
    }

    if (!active) {
      await this.stop(theme.name)
    }
  }
}
