import fs from 'fs'
import { promisify } from 'util'

import Application from '@ioc:Adonis/Core/Application'
import YsOption, { BaseOptions } from 'App/Models/YsOption'
import Origin from 'App/Models/Origin'
import ItemType from 'App/Models/ItemType'
import PluginProviderService from './PluginProviderService'

interface PluginProvider {
  name: string
  path: string
}

export default class PluginHelper {
  public async findProvider(name: string) {
    const allProviders = await this.getRegisteredProviders()

    return allProviders.find((p) => p.name === name)
  }

  public async createProviderInstance(origin: Origin) {
    const allProviders = await this.getRegisteredProviders()

    const provider = allProviders.find((p) => p.name === origin.providerName)

    if (!provider || !provider.valid) {
      throw new Error('error in instantiate provider')
    }

    const ProviderClass = await this.getValidProvider(provider.path)

    const instance = new ProviderClass()

    const type = await ItemType.firstOrCreate({
      name: ProviderClass.entityName || 'unknown',
    })

    instance.config = origin.config
    instance.service = new PluginProviderService(origin, type)

    return instance
  }

  private async getValidProvider(providerPath: string) {
    const providerFullPath = Application.makePath('content', 'plugins', providerPath)

    const exist = promisify(fs.exists)(providerFullPath)

    if (!exist) {
      return null
    }

    const instance = (await import(providerFullPath)).default

    return instance
  }

  public async getRegisteredProviders() {
    const option = await YsOption.findByOrFail('name', BaseOptions.RegisteredContentProviders)
    const providers = option.value as PluginProvider[]

    return await Promise.all(
      providers.map(async (p) => {
        const data = {
          name: p.name,
          valid: false,
          fields: [],
          options: [] as string[],
          path: p.path,
        }

        const provider = await this.getValidProvider(p.path)

        if (!provider) {
          return data
        }

        data.valid = true

        if (provider.fields) {
          data.fields = provider.fields
        }

        if (provider.options) {
          data.options = provider.options
        }

        return data
      })
    )
  }
}
