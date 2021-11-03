import fs from 'fs'
import path from 'path'
import execa from 'execa'
import { pick, uniq } from 'lodash'

import Drive from '@ioc:Adonis/Core/Drive'
import { validator } from '@ioc:Adonis/Core/Validator'

import SystemMeta from 'App/Models/SystemMeta'
import Content from 'App/Services/ContentService'
import { findConfig, isGitUrl } from 'App/Helpers'
import ThemeConfigValidator from 'App/Validators/ThemeConfigValidator'

interface ThemePage {
  title: string
  path: string
}
export interface Theme {
  id: string
  name: string
  active: boolean
  description?: string
  author?: {
    name: string
    email: string
  }
  dashboard?: {
    pages: ThemePage[]
  }
  filename: string
  makePath: (...args: string[]) => string
}

export default class ThemeListener {
  public async index(filter?: { id?: string }) {
    const folders = await fs.promises.readdir(Content.makePath('themes'), {
      withFileTypes: true,
    })

    const active = await SystemMeta.firstOrCreateMetaArray<string>('themes:active')

    const themes = await Promise.all(
      folders
        .filter((f) => f.isDirectory())
        .filter((f) => !filter?.id || f.name === filter.id)
        .map(async (folder) => {
          const theme: any = {
            id: folder.name,
            active: active.includes(folder.name),
            filename: Content.makePath('themes', folder.name),
            makePath: (...args: string[]) => Content.makePath('themes', folder.name, ...args),
          }

          const config = await findConfig(theme.filename)

          Object.assign(theme, pick(config, ['name', 'description', 'dashboard']))

          return theme
        })
    )

    return themes as Theme[]
  }

  public async show(id: string) {
    const theme = await this.index({ id })

    return theme[0] || null
  }

  public async store(gitUrl: string) {
    const name = path.basename(gitUrl).replace('.git', '')
    const filename = Content.makePath('themes', name)
    const isValid = await isGitUrl(gitUrl)

    if (!isValid) {
      throw new Error('Invalid git url')
    }

    const exist = await Drive.exists(filename)

    if (exist) {
      throw new Error('Theme already installed')
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

  public async update({ id, active }: Theme) {
    const theme = await this.show(id)

    if (!theme) {
      throw new Error('Theme not found')
    }

    const activeThemes = await SystemMeta.firstOrCreateMetaArray<string>('themes:active')

    if (!active) {
      await SystemMeta.updateOrCreateMetaArray(
        'themes:active',
        activeThemes.filter((t) => t !== id)
      )
      return
    }

    const config = await validator.validate({
      ...new ThemeConfigValidator(),
      data: await findConfig(theme.filename),
    })

    const checkFiles = ['index.js']

    if (config.dashboard?.pages?.length) {
      checkFiles.push(...config.dashboard.pages.map((f) => f.path))
    }

    const filesValid = await Promise.all(
      checkFiles.map(async (file) => ({
        file,
        exist: await Drive.exists(theme.makePath(file)),
      }))
    )

    const notExist = filesValid.find((f) => !f.exist)

    if (notExist) {
      throw new Error(`File ${notExist.file} not found`)
    }

    await SystemMeta.updateOrCreateMetaArray('themes:active', uniq([...activeThemes, id]))
  }

  // public async runScript(data: { name: string; script: string }) {
  //   const theme = await this.show(data.name)

  //   if (!theme) {
  //     throw new Error('Theme not found')
  //   }

  //   if (!theme.scripts || !theme.scripts[data.script]) {
  //     throw new Error('Theme script not found')
  //   }

  //   const [file, ...args] = theme.scripts[data.script].split(' ')

  //   await execa(file, args, {
  //     cwd: theme.filename,
  //   })
  // }
}
