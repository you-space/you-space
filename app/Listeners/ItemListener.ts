import Item from 'App/Models/Item'

import Type from 'App/Models/Type'
import { validator } from '@ioc:Adonis/Core/Validator'
import ItemStoreValidator from 'App/Validators/ItemStoreValidator'
import ItemIndexValidator from 'App/Validators/ItemIndexValidator'
import ItemValueValidator from 'App/Validators/ItemValueValidator'
import ItemUpdateValidator from 'App/Validators/ItemUpdateValidator'

export default class ItemListener {
  public async index(payload: any = {}) {
    const filters = await validator.validate({
      schema: new ItemIndexValidator().schema,
      data: payload,
    })

    const query = Item.query()

    if (filters.id) {
      query.whereIn('id', filters.id.split(','))
    }

    const include = (filters?.include || '').split(',')

    if (include.includes('visibility')) {
      query.preload('visibility', (q) => q.select('name'))
    }

    if (include.includes('type')) {
      query.preload('type', (q) => q.select('name'))
    }

    const paginate = await query.paginate(filters?.page || 1, filters?.limit)

    const data = paginate.all().map((item) => {
      if (!filters?.raw) {
        return item.serializeByTypeSchema()
      }

      return item.serialize()
    })

    return {
      meta: paginate.getMeta(),
      data,
    }
  }

  public async store(payload: any = {}) {
    const data = await validator.validate({
      schema: new ItemStoreValidator().schema,
      data: payload,
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
