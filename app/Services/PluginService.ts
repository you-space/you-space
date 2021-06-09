import path from 'path'
import YsOption from 'App/Models/YsOption'
import Logger from '@ioc:Adonis/Core/Logger'
import ItemType, { ItemTypeOptions } from 'App/Models/ItemType'
import { DateTime } from 'luxon'

interface ProviderOptions {
  name: string
  itemType: string
  path: string
}

export class PluginService {
  public logger = Logger

  constructor(public pluginName: string) {}

  public makePluginPath(...args: string[]) {
    return path.join(this.pluginName, ...args)
  }

  public async registerItemType(name: string, options: ItemTypeOptions) {
    await ItemType.updateOrCreate({ name }, { name, options, deletedAt: null })
  }

  public async unregisterItemType(name: string) {
    const type = await ItemType.findBy('name', name)

    if (!type) {
      throw new Error(`type ${name} not registered`)
    }

    type.deletedAt = DateTime.now()

    await type.save()
  }

  public async registerProvider(options: ProviderOptions) {
    const name = `plugins:${this.pluginName}:providers:${options.name}`

    const type = await ItemType.findBy('name', options.itemType)

    if (!type) {
      throw new Error(`type ${options.itemType} not registered`)
    }

    await YsOption.updateOrCreate(
      { name },
      {
        name: name,
        value: options,
      }
    )
  }

  public async unregisterProvider(providerName: string) {
    const name = `plugins:${this.pluginName}:providers:${providerName}`
    const option = await YsOption.findBy('name', name)

    if (!option) {
      throw new Error('provider not found')
    }

    await option.delete()
  }
}
