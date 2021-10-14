import Type from 'App/Models/Type'
import Logger from '@ioc:Adonis/Core/Logger'

interface Filters {
  [prop: string]: any
  page?: number
  limit?: number

  id?: string
  search?: string

  random?: boolean
}

export default class TypeManager {
  constructor(private allowWrite = true) {}

  public async create(name: string, options: Type['options']) {
    if (!this.allowWrite) {
      Logger.error('write is disabled for manger')
      return
    }

    await Type.updateOrCreate({ name }, { name, options, deletedAt: null })
  }

  public async delete(name: string) {
    if (!this.allowWrite) {
      Logger.error('write is disabled for manger')
      return
    }

    const type = await Type.findBy('name', name)

    if (type) {
      await type.delete()
    }
  }

  public async fetchItems(typeName: string, filters?: Filters) {
    const type = await Type.fetchByIdOrName(typeName).firstOrFail()

    const query = type
      .related('items')
      .query()
      .preload('metas')
      .preload('itemFiles')
      .preload('visibility', (s) => s.select('name'))

    if (filters?.search) {
      query.whereRaw('to_tsvector(value) @@ plainto_tsquery(?)', [filters.search])
    }

    if (filters?.id) {
      query.whereIn(
        'id',
        filters.id
          .split(',')
          .map((i) => Number(i))
          .filter((i) => !isNaN(i))
      )
    }

    if (filters?.random) {
      query.orderByRaw('random()')
    }

    const paginate = await query.paginate(filters?.page || 1, filters?.limit)

    const data = paginate.all().map((i) => i.serializeByTypeSchema())

    return {
      meta: paginate.getMeta(),
      data,
    }
  }

  public async find(typeName: string, filters?: Filters) {
    const { data } = await this.fetchItems(typeName, {
      ...filters,
      limit: 1,
    })

    if (!data[0]) {
      return null
    }

    return data[0]
  }
}
