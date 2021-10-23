import fs from 'fs'
import Application from '@ioc:Adonis/Core/Application'
import Drive from '@ioc:Adonis/Core/Drive'
import Space from 'App/Services/SpaceService'
import SystemMeta, { SystemDefaults } from 'App/Models/SystemMeta'

export interface Theme {
  filename: string
}

export default class ThemeListener {
  public async index() {
    const folders = await fs.promises.readdir(Application.makePath('content', 'themes'), {
      withFileTypes: true,
    })

    return folders
      .filter((f) => f.isDirectory())
      .map((t) => ({
        name: t.name,
      }))
  }

  public async show(name: string) {
    const filename = Application.makePath('content', 'themes', name, 'index.js')

    const exist = await Drive.exists(filename)

    if (!exist) {
      throw new Error(`theme ${name} not found`)
    }

    return {
      filename,
      name,
    }
  }

  public async activate(name: string) {
    const theme = await this.show(name)

    const { start } = await import(theme.filename)

    if (start) {
      await start()
    }

    await SystemMeta.updateOrCreate(
      {
        name: SystemDefaults.CurrentTheme,
      },
      {
        name: SystemDefaults.CurrentTheme,
        value: name,
      }
    )
  }
}
