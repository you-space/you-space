import Application from '@ioc:Adonis/Core/Application'
import fs from 'fs'
import { promisify } from 'util'
import YsOption, { BaseOptions } from 'App/Models/YsOption'

interface Provider {
  name: string
  path: string
}

export default class ProvidersController {
  public async index() {
    const option = await YsOption.findByOrFail('name', BaseOptions.ContentProviders)
    const value = option.value as Provider[]

    const providers = await Promise.all(
      value.map(async ({ path, name }) => {
        const providerPath = Application.makePath('content', 'plugins', path)
        const exist = await promisify(fs.exists)(providerPath)
        return {
          name,
          path,
          exist,
        }
      })
    )

    return providers.filter((p) => p.exist)
  }
}
