import Item from 'App/Models/Item'
import Origin from 'App/Models/Origin'
import SystemMeta from 'App/Models/SystemMeta'
import Type from 'App/Models/Type'
import BaseExtension from './Utils/BaseExtension'
import { manager, method, property } from './Utils/Decorators'
import ItemsManager from './Utils/ItemsManager'

export default class Provider extends BaseExtension {
  @method()
  public import: () => Promise<void>

  @manager.item()
  public item: ItemsManager

  @property()
  public config?: Origin['config']

  public useOrigin(origin: Origin) {
    this.config = origin.config

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

  public static async findOrFail(name: string) {
    const meta = await SystemMeta.findBy('name', name)

    if (!meta) {
      throw new Error('provider not found')
    }

    return this.$mount(meta.value)
  }
}
