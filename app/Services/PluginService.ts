import fs from 'fs'
import path from 'path'
import { promisify } from 'util'

import YsOption, { BaseOptions } from 'App/Models/YsOption'
import Application from '@ioc:Adonis/Core/Application'
import Logger from '@ioc:Adonis/Core/Logger'

interface Provider {
  name: string
  path: string
}

export class PluginService {
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
    const providers = option.value as Provider[]

    return await Promise.all(
      providers.map(async (p) => {
        const data = {
          name: p.name,
          valid: false,
          fields: [],
        }

        const provider = await this.getValidProvider(p.path)

        if (provider) {
          data.valid = true

          if (provider.fields) {
            data.fields = provider.fields
          }
        }

        return data
      })
    )
  }

  public async registerProvider(name: string, path: string) {
    const option = await YsOption.findByOrFail('name', BaseOptions.RegisteredContentProviders)
    const providers = option.value as Provider[]

    if (providers.some((p) => p.name === name)) {
      Logger.error('already registered provider')
      return
    }

    providers.push({ name, path })

    option.value = providers

    await option.save()
  }

  public async unregisterProvider(name: string) {
    const option = await YsOption.findByOrFail('name', BaseOptions.RegisteredContentProviders)
    const providers = option.value as Provider[]

    const index = providers.findIndex((p) => p.name === name)

    if (index === -1) {
      Logger.error('Provider no registered')
      return
    }

    providers.splice(index, 1)

    option.value = providers

    await option.save()
  }

  public makePluginPath(pluginName: string, ...args: string[]) {
    return Application.makePath(pluginName, ...args)
  }

  public createPluginService(pluginName: string) {
    return {
      makePluginPath: (...args: string[]) => path.join(pluginName, ...args),
      registerProvider: this.registerProvider,
      unregisterProvider: this.unregisterProvider,
    }
  }
}
