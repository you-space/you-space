import fs from 'fs'
import { promisify } from 'util'

import Application from '@ioc:Adonis/Core/Application'
import YsOption from 'App/Models/YsOption'
import Origin from 'App/Models/Origin'
import ItemType from 'App/Models/ItemType'
import PluginProviderService from './PluginProviderService'

export default class PluginHelper {
  private async getValidProvider(providerPath: string) {
    const providerFullPath = Application.makePath('content', 'plugins', providerPath)

    const exist = promisify(fs.exists)(providerFullPath)

    if (!exist) {
      return null
    }

    const instance = (await import(providerFullPath)).default

    return instance
  }

  public async findProvider(name: string) {
    const option = await YsOption.fetchByName(`plugins:*:providers:${name}`).first()

    if (!option) {
      return null
    }

    const fullPath = Application.makePath('content', 'plugins', option.value.path)

    const exist = await promisify(fs.exists)(fullPath)

    return {
      ...option.value,
      valid: exist,
    }
  }

  public async createProviderInstance(origin: Origin) {
    const provider = await this.findProvider(origin.providerName)

    if (!provider || !provider.valid) {
      throw new Error('error in instantiate provider')
    }

    const type = await ItemType.findBy('name', provider.itemType)

    if (!type) {
      throw new Error(`type ${provider.itemType} not registered`)
    }

    const ProviderClass = await this.getValidProvider(provider.path)

    const instance = new ProviderClass()

    instance.config = origin.config
    instance.service = new PluginProviderService(origin, type)

    return instance
  }

  public async fetchProviders() {
    const options = await YsOption.fetchByName('plugins:*:providers:*')

    return await Promise.all(
      options.map(async ({ value }) => {
        const fullPath = Application.makePath('content', 'plugins', value.path)

        const exist = promisify(fs.exists)(fullPath)

        return {
          ...value,
          valid: exist,
        }
      })
    )
  }
}
