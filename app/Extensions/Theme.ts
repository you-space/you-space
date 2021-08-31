import fs from 'fs'
import Application from '@ioc:Adonis/Core/Application'

import SystemMeta, { SystemDefaults } from 'App/Models/SystemMeta'
import BaseExtension from './Utils/BaseExtension'
import { method, property } from './Utils/Decorators'

export default class Theme extends BaseExtension {
  public name: string

  @method()
  public render: (url: string) => Promise<string>

  @property()
  public assets: string[]

  public async isActive() {
    const currentTheme = await Theme.findCurrentTheme()

    return this.name === currentTheme
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

  public static async findCurrentTheme() {
    const meta = await SystemMeta.firstOrCreate({
      name: SystemDefaults.CurrentTheme,
    })

    return (meta.value as string) || null
  }

  public static async setTheme(name: string) {
    const theme = await Theme.findOrFail(name)

    const currentTheme = await this.findCurrentTheme()

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
}
