import path from 'path'
import YsOption, { BaseOptions } from 'App/Models/YsOption'
import Logger from '@ioc:Adonis/Core/Logger'
import Origin from 'App/Models/Origin'
import Item from 'App/Models/Item'
import ItemType from 'App/Models/ItemType'

interface Provider {
  name: string
  path: string
}

export class PluginService {
  public logger = Logger

  constructor(public pluginName: string) {}

  public makePluginPath(...args: string[]) {
    return path.join(this.pluginName, ...args)
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

  public createOriginProviderService(origin: Origin, type: ItemType) {
    return {
      logger: Logger,
      createMany: (items: any[]) =>
        Item.updateOrCreateMany(
          ['sourceId', 'originId', 'typeId'],
          items.map((item) => ({
            originId: origin.id,
            typeId: type.id,
            sourceId: item.id,
            value: item.data,
          }))
        ),
    }
  }
}
