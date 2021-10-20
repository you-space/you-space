import Application from '@ioc:Adonis/Core/Application'
import Drive from '@ioc:Adonis/Core/Drive'

export interface Theme {
  filename: string
}

export default class ThemeListener {
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
}
