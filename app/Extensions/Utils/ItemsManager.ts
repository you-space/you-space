import Item from 'App/Models/Item'
import Type from 'App/Models/Type'
import Logger from '@ioc:Adonis/Core/Logger'
export interface Filters {
  page?: number
  limit?: number
  search?: string
}

export default class ItemsManager {
  constructor(private allowWrite = true) {}

  public async fetchItems(filters?: Filters, serialize = false) {
    const query = Item.query()
      .preload('metas')
      .preload('itemFiles')
      .preload('visibility', (s) => s.select('name'))

    if (filters?.search) {
      query
        .whereRaw('to_tsvector(value) @@ plainto_tsquery(?)', [filters.search])
        .orWhereHas('metas', (q) =>
          q.whereRaw('to_tsvector(value) @@ plainto_tsquery(?)', [filters.search as string])
        )
    }

    const paginate = await query.paginate(filters?.page || 1, filters?.limit)

    let data = paginate.all()

    if (serialize) {
      data = paginate.all().map((i) => i.serializeByTypeSchema())
    }

    return {
      meta: paginate.getMeta(),
      data,
    }
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
