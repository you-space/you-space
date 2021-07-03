import lodash from 'lodash'
import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import { schema, TypedSchema } from '@ioc:Adonis/Core/Validator'

import Item from 'App/Models/Item'
import ItemType from 'App/Models/ItemType'
import File from 'App/Models/File'

import ItemIndexValidator from 'App/Validators/ItemIndexValidator'
import { serializedItemByType } from 'App/Services/ItemService'

export default class ItemsController {
  public async index({ request }: HttpContextContract) {
    const filters = await request.validate(ItemIndexValidator)

    const query = Item.query()
    let type: ItemType

    if (filters.typeId) {
      query.where('typeId', filters.typeId)

      type = await ItemType.query().preload('fields').where('id', filters.typeId).firstOrFail()
    } else {
      query.preload('type').preload('visibility').preload('origin')
    }

    if (filters.serialize) {
      query.preload('fields')
      query.preload('visibility')
    }

    const pagination = await query.paginate(filters.page || 1, filters.limit)

    const items = pagination.all().map((item) => {
      if (filters.serialize) {
        return serializedItemByType(type, item, filters.showOriginals)
      }

      return {
        id: item.id,
        value: item.value,

        originId: item.originId,
        originName: item.origin.name,

        typeId: item.typeId,
        typeName: item.type.name,

        visibilityName: item.visibility.name,
      }
    })

    return {
      meta: pagination.getMeta(),
      data: items,
    }
  }

  public async show({ params, request }: HttpContextContract) {
    const filters = await request.validate({
      schema: schema.create({
        serialize: schema.boolean.optional(),
        showOriginals: schema.boolean.optional(),
      }),
    })

    if (filters.serialize) {
      const item = await Item.query()
        .where('id', params.id)
        .preload('type', (q) => q.preload('fields'))
        .preload('fields')
        .preload('visibility')
        .firstOrFail()

      return serializedItemByType(item.type, item, filters.showOriginals)
    }

    const item = await Item.query()
      .where('id', params.id)
      .preload('type')
      .preload('origin')
      .preload('visibility')
      .firstOrFail()

    return {
      id: item.id,
      value: item.value,

      originId: item.originId,
      originName: item.origin.name,

      typeId: item.typeId,
      typeName: item.type.name,

      visibilityName: item.visibility?.name,
    }
  }

  public async updateItemFiles({ params, request }: HttpContextContract) {
    const item = await Item.query()
      .where('id', params.id)
      .preload('type', (q) => q.preload('fields'))
      .preload('fields')
      .preload('visibility')
      .firstOrFail()

    const fileFields = item.type.fields
      .filter((f) => f.options.input?.editable)
      .filter((f) => ['image', 'video'].includes(f.options.input?.type || ''))

    const fileFieldsSchema: TypedSchema = fileFields.reduce(
      (all, f) => ({
        ...all,
        [f.name]: schema.file.optional(),
      }),
      {}
    )

    const payload = await request.validate({
      schema: schema.create(fileFieldsSchema),
    })

    const itemFieldsToDelete = fileFields
      .filter((f) => request.body()[f.name] === null)
      .map((f) => item.fields.find((itemField) => itemField.name === f.name))

    await Promise.all(
      itemFieldsToDelete.map(async (itemField) => (itemField ? await itemField.delete() : null))
    )

    const uploadFiles = await Promise.all(
      Object.entries(payload).map(async ([name, file]) => ({
        name,
        file: await File.upload(file as any),
      }))
    )

    await item.related('fields').updateOrCreateMany(
      uploadFiles.map(({ name, file }) => ({
        name: name,
        type: 'file',
        value: String(file.id),
      })),
      ['name']
    )
  }

  public async update({ params, request }: HttpContextContract) {
    const item = await Item.query()
      .where('id', params.id)
      .preload('type', (q) => q.preload('fields'))
      .preload('fields')
      .preload('visibility')
      .firstOrFail()

    const typeSchema = item.type.fields
      .filter((f) => f.options.input?.editable)
      .filter((f) => !['image', 'video'].includes(f.options.input?.type || ''))
      .reduce(
        (all, f) => ({
          ...all,
          [f.name]: schema.string.optional(),
        }),
        {}
      )

    const payload = await request.validate({
      schema: schema.create({
        visibilityId: schema.number.optional(),
        ...typeSchema,
      }),
    })

    const itemFieldsToCreate = item.type.fields
      .filter((f) => f.options.input?.editable)
      .filter((f) => payload[f.name])
      .filter((f) => lodash.get(item.value, f.options.mapValue || '') !== payload[f.name])
      .map((f) => ({ name: f.name, value: payload[f.name] }))

    const itemFieldsToDelete = item.type.fields
      .filter((f) => !['image', 'video'].includes(f.options.input?.type || ''))
      .filter((f) => payload[f.name] === null || !f.options.input?.editable)
      .map((f) => f.name)

    if (payload.visibilityId) {
      item.visibilityId = payload.visibilityId
    }

    await item.related('fields').query().delete().whereIn('name', itemFieldsToDelete)

    await item.related('fields').updateOrCreateMany(itemFieldsToCreate, ['name'])

    await item.save()

    return {
      status: 200,
      message: 'Item updated',
    }
  }
}
