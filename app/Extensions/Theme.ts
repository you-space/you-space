import fs from 'fs'
import execa from 'execa'
import path from 'path'

import Application from '@ioc:Adonis/Core/Application'
import Drive from '@ioc:Adonis/Core/Drive'

import SystemMeta, { SystemDefaults } from 'App/Models/SystemMeta'
import BaseExtension from './Utils/BaseExtension'
import { manager, method, property } from './Utils/Decorators'
import User from 'App/Models/User'
import ItemsManager from './Utils/ItemsManager'
import TypeManager from './Utils/TypeManager'
import { isGithubUrl } from 'App/Services/Helpers'

interface RenderArgs {
  path: string
  fullPath: string
  query: Record<string, string>
  params: string[]
  user?: ReturnType<User['serialize']>
  site: {
    title: string
  }
}

export default class Theme extends BaseExtension {
  public name: string

  @method()
  public render: (args: RenderArgs) => Promise<string>

  @property()
  public assets?: Map<string, string>

  @property()
  public scripts?: Map<string, string[]>

  @manager.item(false)
  public item: ItemsManager

  @manager.type(false)
  public type: TypeManager

  public async isActive() {
    const currentTheme = await Theme.findCurrentThemeName()

    return this.name === currentTheme
  }

  public get filename() {
    return Application.makePath('content', 'themes', this.name)
  }

  public static async all() {
    const folders = await fs.promises.readdir(Application.makePath('content', 'themes'), {
      withFileTypes: true,
    })

    const themes = await Promise.all(
      folders.filter((f) => f.isDirectory()).map((f) => this.find(f.name))
    )

    return themes.filter((t) => !!t) as Theme[]
  }

  public static async find(name: string) {
    const theme = await this.$mount(Application.makePath('content', 'themes', name || ''))

    if (!theme) {
      return null
    }

    theme.name = name

    return theme
  }

  public static async findOrFail(name: string) {
    const theme = await this.$mount(Application.makePath('content', 'themes', name || ''))

    if (!theme) {
      throw new Error('theme not found')
    }

    theme.name = name

    return theme
  }

  public static async findCurrentThemeName() {
    const meta = await SystemMeta.firstOrCreate({
      name: SystemDefaults.CurrentTheme,
    })

    return (meta.value as string) || null
  }

  public static async findCurrentTheme() {
    const meta = await SystemMeta.firstOrCreate({
      name: SystemDefaults.CurrentTheme,
    })

    if (!meta.value) {
      return null
    }

    return this.find(meta.value)
  }

  public static async create(url: string) {
    const name = path.basename(url).replace('.git', '')

    const filename = Application.makePath('content', 'themes', name)

    const isValid = await isGithubUrl(url)

    if (!isValid) {
      throw new Error('Repository url invalid')
    }

    const exist = await Drive.exists(filename)

    if (exist) {
      throw new Error('theme already installed')
    }

    await execa('git', ['clone', url, filename])
  }

  public static async setTheme(name: string) {
    const theme = await Theme.findOrFail(name)

    const currentTheme = await this.findCurrentThemeName()

    if (name === currentTheme) {
      throw new Error('theme already in use')
    }

    await SystemMeta.updateOrCreate(
      {
        name: SystemDefaults.CurrentTheme,
      },
      {
        name: SystemDefaults.CurrentTheme,
        value: theme.name,
      }
    )
  }

  public async delete() {
    await execa('rm', ['-rf', this.filename])
  }
}
