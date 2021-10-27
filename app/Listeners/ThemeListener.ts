import fs from 'fs'
import path from 'path'
import { pick, uniq } from 'lodash'
import Application from '@ioc:Adonis/Core/Application'
import Drive from '@ioc:Adonis/Core/Drive'
import SystemMeta from 'App/Models/SystemMeta'
import { isGitUrl } from 'App/Helpers'
import execa from 'execa'

export interface Theme {
  name: string
  active: boolean
  description?: string
  scripts?: Record<string, string>
  filename: string
  makePath: (...args: string[]) => string
}

export default class ThemeListener {
  public async index(filter?: string[]) {
    const folders = await fs.promises.readdir(Application.makePath('content', 'themes'), {
      withFileTypes: true,
    })

    const active = await SystemMeta.firstOrCreateMetaArray<string>('themes:active')

    const themes = await Promise.all(
      folders
        .filter((f) => f.isDirectory())
        .filter((t) => !filter || filter.includes(t.name))
        .map(async (folder) => {
          const theme = {
            id: folder.name,
            name: folder.name,
            active: active.includes(folder.name),
            filename: Application.makePath('content', 'themes', folder.name),
            makePath: (...args: string[]) =>
              Application.makePath('content', 'themes', folder.name, ...args),
          }

          const exist = await Drive.exists(theme.makePath('space.json'))

          if (exist) {
            const content = await Drive.get(theme.makePath('space.json'))
            Object.assign(
              theme,
              pick(JSON.parse(content.toString()), ['name', 'description', 'scripts'])
            )
          }

          return theme
        })
    )

    return themes as Theme[]
  }

  public async show(name: string) {
    const theme = await this.index([name])

    return theme[0] || null
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

  public async runScript(data: { name: string; script: string }) {
    const theme = await this.show(data.name)

    if (!theme) {
      throw new Error('Theme not found')
    }

    if (!theme.scripts || !theme.scripts[data.script]) {
      throw new Error('Theme script not found')
    }

    const [file, ...args] = theme.scripts[data.script].split(' ')

    await execa(file, args, {
      cwd: theme.filename,
    })
  }
}
