import Item from 'App/Models/Item'
import Type from 'App/Models/Type'
import Logger from '@ioc:Adonis/Core/Logger'
export interface Filters {
  page?: number
  limit?: number
  typeId?: number
}

export default class ItemsManager {
  constructor(private allowWrite = true) {}

  public async fetchItems(filters?: Filters) {
    const query = Item.query()
      .preload('metas')
      .preload('itemFiles')
      .preload('visibility', (s) => s.select('name'))

    return query.paginate(filters?.page || 1, filters?.limit)
  }

  public async createMany(typeName: string, items: Partial<Item>[]) {
    if (!this.allowWrite) {
      Logger.error('write is disabled for manger')
      return
    }

    const type = await Type.query().where('name', typeName).whereNull('deletedAt').first()

    if (!type) {
      throw new Error('type not found')
    }

    type.related('items').updateOrCreateMany(
      items.map((item) => ({
        sourceId: item.sourceId,
        value: item.value,
      })),
      ['sourceId', 'typeId']
    )
  }
}
