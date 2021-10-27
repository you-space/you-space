import Item from 'App/Models/Item'
import lodash from 'lodash'

import Type, { TypeSchema } from 'App/Models/Type'
import { validator } from '@ioc:Adonis/Core/Validator'
import ItemStoreValidator from 'App/Validators/ItemStoreValidator'
import ItemIndexValidator from 'App/Validators/ItemIndexValidator'
import ItemValueValidator from 'App/Validators/ItemValueValidator'
import ItemUpdateValidator from 'App/Validators/ItemUpdateValidator'

export default class ItemListener {
  public async index(payload?: any) {
    const types: Type[] = await Promise.all(
      (payload?.type || '')
        .split(',')
        .filter((t) => !!t)
        .map((t) => Type.fetchByIdOrName(t).firstOrFail())
    )

    const schemas = types.map((type) => type.findSchema()).filter((s) => !!s)

    const filters = await validator.validate({
      schema: new ItemIndexValidator(schemas as TypeSchema[]).schema,
      data: payload || {},
    })

    const query = Item.query()
    const include = (filters?.include || '').split(',')

    if (filters.id) {
      query.whereIn('id', filters.id.split(','))
    }

    if (include.includes('visibility')) {
      query.preload('visibility', (q) => q.select('name'))
    }

    if (include.includes('type')) {
      query.preload('type', (q) => q.select('name'))
    }

    if (filters.search) {
      query.whereRaw(`LOWER(value::text) LIKE '%${filters.search.toLowerCase()}%'`)
    }

    if (types.length) {
      query.whereIn(
        'type_id',
        types.map((type) => type.id)
      )

      types.forEach((type) => {
        const schema = type.findSchema()

        if (!schema) return

        Object.entries(schema)
          .filter(([, value]) => !!value.map)
          .forEach(([key, value]) => {
            if (filters.orderBy === key) {
              query.apply((s) => s.orderByValueProperty(value.map as string, filters.orderDesc))
            }

            if (filters[key]) {
              query.apply((s) => s.whereValueProperty(value.map as string, filters[key]))
            }
          })
      })
    }

    const paginate = await query.paginate(filters?.page || 1, filters?.limit)

    const data = paginate.all().map((item) => {
      const content = filters?.raw ? item.serialize() : item.serializeByTypeSchema()

      return filters.pick ? lodash.pick(content, filters.pick.split(',')) : content
    })

    return {
      meta: paginate.getMeta(),
      data,
    }
  }

  public async store(payload: any) {
    const data = await validator.validate({
      schema: new ItemStoreValidator().schema,
      data: payload || {},
    })

    const type = await Type.fetchByIdOrName(data.type).first()

    if (!type) {
      throw new Error('type not found')
    }

    const schema = Type.findSchemaById(type.id)

    if (!schema) {
      throw new Error('type schema not found')
    }

    const value = await validator.validate({
      schema: new ItemValueValidator(schema).schema,
      data: data.value,
    })

    const item = await type.related('items').create({
      visibilityId: payload.visibilityId,
      sourceId: payload.sourceId,
      value,
    })

    await item.refresh()

    return item.serialize()
  }

  public async update(payload: any = {}) {
    const data = await validator.validate({
      schema: new ItemUpdateValidator().schema,
      data: payload,
    })

    const item = await Item.find(data.id)

    if (!item) {
      throw new Error('item not found')
    }

    const schema = Type.findSchemaById(item.typeId)

    if (!schema) {
      throw new Error('type schema not found')
    }

    const value = await validator.validate({
      schema: new ItemValueValidator(schema).schema,
      data: data.value,
    })

    Object.assign(item, data)

    item.value = value

    await item.save()

    return {
      message: 'item updated',
    }
  }

  public async destroy(id: number) {
    const item = await Item.find(id)

    if (!item) {
      throw new Error('item not found')
    }

    await item.delete()
  }
}
