import fs from 'fs'
import { promisify } from 'util'

import Application from '@ioc:Adonis/Core/Application'
import SystemMeta from 'App/Models/SystemMeta'
import Origin from 'App/Models/Origin'
import ItemType from 'App/Models/Type'
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
    const meta = await SystemMeta.fetchByName(`plugins:*:providers:${name}`).first()

    if (!meta) {
      return null
    }

    const options = JSON.parse(meta.value)

    const fullPath = Application.makePath('content', 'plugins', options.path)

    const exist = await promisify(fs.exists)(fullPath)

    return {
      ...options,
      valid: exist,
    }
  }

  public async createProviderInstance(origin: Origin) {
    const provider = await this.findProvider(origin.providerName)

    if (!provider || !provider.valid) {
      throw new Error('error in instantiate provider')
    }

    const ProviderClass = await this.getValidProvider(provider.path)

    const instance = new ProviderClass()

    instance.config = origin.config
    instance.service = new PluginProviderService(origin)

    return instance
  }

  public async fetchProviders() {
    const metas = await SystemMeta.fetchByName('plugins:*:providers:*')

    return Promise.all(
      metas.map(async (meta) => {
        const name = meta.name.split(':').pop()
        const options = JSON.parse(meta.value)

        const fullPath = Application.makePath('content', 'plugins', options.path)

        const exist = await promisify(fs.exists)(fullPath)

        return {
          name,
          valid: exist,
          ...options,
        }
      })
    )
  }
}
