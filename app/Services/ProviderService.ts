import Logger from '@ioc:Adonis/Core/Logger'
import Item from 'App/Models/Item'
import Origin from 'App/Models/Origin'
import Type from 'App/Models/Type'

export default class ProviderService {
  public logger = Logger
  constructor(public origin: Origin) {}

  public async createManyItems(typeName: string, items: any[]) {
    const type = await Type.query().where('name', typeName).whereNull('deletedAt').first()

    if (!type) {
      throw new Error('type not found')
    }

    return Item.updateOrCreateMany(
      ['sourceId', 'originId', 'typeId'],
      items.map((item) => ({
        originId: this.origin.id,
        typeId: type.id,
        sourceId: item.id,
        value: item.data,
      }))
    )
  }
}
