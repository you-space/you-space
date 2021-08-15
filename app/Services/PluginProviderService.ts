import Logger from '@ioc:Adonis/Core/Logger'
import Item from 'App/Models/Item'
import ItemType from 'App/Models/Type'
import Origin from 'App/Models/Origin'

export default class PluginProviderService {
  public logger = Logger
  constructor(public origin: Origin, public type: ItemType) {}

  public createMany(items: any[]) {
    return Item.updateOrCreateMany(
      ['sourceId', 'originId', 'typeId'],
      items.map((item) => ({
        originId: this.origin.id,
        typeId: this.type.id,
        sourceId: item.id,
        value: item.data,
      }))
    )
  }
}
