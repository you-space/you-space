import Origin from 'App/Models/Origin'
import SystemMeta from 'App/Models/SystemMeta'
import Type from 'App/Models/Type'
import BaseExtension from './BaseExtension'
import { extProperty } from './Decorators'

export interface ProviderOptions {
  name: string

  path: string

  pluginName: string

  fields: any[]
}

export default class Provider extends BaseExtension {
  public static data = async () => {
    const metas = await SystemMeta.fetchByName(`providers:*`)
    return metas.map((meta) => {
      const [, name] = meta.name.split(':')

      const options: ProviderOptions = JSON.parse(meta.value)

      return {
        ...options,
        name,
      }
    })
  }

  @extProperty('ext-method')
  public import: () => Promise<void>

  //   public name: string

  //   public path: string

  //   public pluginName: string

  //   public fields: ProviderFields[]

  public static async importOrigin(origin: Origin) {
    const provider = await this.findOrFail(origin.providerName)

    provider.createManyItems = async (typeName: string, items: any[]) => {
      const type = await Type.query().where('name', typeName).whereNull('deletedAt').first()

      if (!type) {
        throw new Error('type not found')
      }

      return type.related('items').updateOrCreateMany(
        items.map((item) => ({
          sourceId: item.id,
          originId: origin.id,
          value: item.data,
        })),
        ['sourceId', 'originId', 'typeId']
      )
    }

    provider.updateInstance({
      config: origin.config,
    })

    provider.import()
  }
}
