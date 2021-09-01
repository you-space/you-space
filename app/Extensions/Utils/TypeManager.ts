import Item from 'App/Models/Item'
import Type from 'App/Models/Type'
import TypeField from 'App/Models/TypeField'
import Logger from '@ioc:Adonis/Core/Logger'

interface Filters {
  page?: number
  limit?: number
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

  public async createFields(name: string, fields: TypeField['options'] & { name: string }[]) {
    if (!this.allowWrite) {
      Logger.error('write is disabled for manger')
      return
    }

    const type = await Type.findBy('name', name)

    if (!type) {
      throw new Error(`type ${name} not registered`)
    }

    await type.related('fields').updateOrCreateMany(fields, 'name')
  }

  public async deleteFields(name: string, fields: string[]) {
    if (!this.allowWrite) {
      Logger.error('write is disabled for manger')
      return
    }

    const type = await Type.findBy('name', name)

    if (!type) {
      throw new Error(`type ${name} not registered`)
    }

    await type.related('fields').query().delete().whereIn('name', fields)
  }

  public async fetchItems(typeName: string, filters?: Filters) {
    const type = await Type.fetchByIdOrName(typeName).preload('fields').firstOrFail()

    const query = type
      .related('items')
      .query()
      .preload('metas')
      .preload('itemFiles')
      .preload('visibility', (s) => s.select('name'))

    const paginate = await query.paginate(filters?.page || 1, filters?.limit)

    const data = paginate.all().map((i) => i.serializeByType(type))

    return {
      data,
      meta: paginate.getMeta(),
    }
  }
}
