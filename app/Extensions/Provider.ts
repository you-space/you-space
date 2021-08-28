import Queue from '@ioc:Queue'
import { key } from 'App/Queue/jobs/ProviderJobs'

import Item from 'App/Models/Item'
import Origin from 'App/Models/Origin'
import SystemMeta from 'App/Models/SystemMeta'
import Type from 'App/Models/Type'

import BaseExtension from './Utils/BaseExtension'
import { manager, method, property } from './Utils/Decorators'
import ItemsManager from './Utils/ItemsManager'

export default class Provider extends BaseExtension {
  @method()
  public import: (setProgress: any) => Promise<void>

  @manager.item()
  public item: ItemsManager

  @property()
  public config?: Origin['config']

  @property()
  public fields?: any[]

  @property()
  public options?: string[]

  public name: string

  public originId: number

  public useOrigin(origin: Origin) {
    this.config = origin.config
    this.originId = origin.id

    this.item.createMany = async (typeName: string, items: Item[]) => {
      const type = await Type.query().where('name', typeName).whereNull('deletedAt').first()

      if (!type) {
        throw new Error('type not found')
      }

      type.related('items').updateOrCreateMany(
        items.map((item) => ({
          sourceId: item.sourceId,
          value: item.value,
          originId: origin.id,
        })),
        ['sourceId', 'originId', 'typeId']
      )
    }
  }

  public static async all() {
    const metas = await SystemMeta.fetchByName('providers:*')

    return await Promise.all(metas.map(async (m) => this.findOrFail(m.name)))
  }

  public static async find(name: string) {
    const meta = await SystemMeta.findBy('name', name)

    if (!meta) {
      return null
    }

    const provider = await this.$mount(meta.value)

    provider.name = name

    return provider
  }

  public static async findOrFail(name: string) {
    const provider = await this.find(name)

    if (!provider) {
      throw new Error('provider not found')
    }

    return provider
  }

  @method.inject()
  public addJob(methodName: string, data: any) {
    Queue.add(key, {
      providerName: this.name,
      methodName,
      data,
      originId: this.originId,
    })
  }
}
