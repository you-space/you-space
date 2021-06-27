import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import { schema, TypedSchema } from '@ioc:Adonis/Core/Validator'
import { types } from '@ioc:Adonis/Core/Helpers'
import Item from 'App/Models/Item'
import ItemType from 'App/Models/ItemType'
import File from 'App/Models/File'
import lodash from 'lodash'
import Logger from '@ioc:Adonis/Core/Logger'
import Database from '@ioc:Adonis/Lucid/Database'

export default class ItemsController {
  public async all({ request }: HttpContextContract) {
    const filters = await request.validate({
      schema: schema.create({
        page: schema.number.optional(),
        limit: schema.number.optional(),
      }),
    })

    const query = Item.query().preload('type').preload('visibility').preload('origin')

    const pagination = await query.paginate(filters.page || 1, filters.limit)

    const data = pagination.all().map((i) => ({
      id: i.id,
      value: i.value,

      originId: i.originId,
      originName: i.origin.name,

      typeId: i.typeId,
      typeName: i.type.name,

      visibilityName: i.visibility.name,
    }))

    return {
      data,
      meta: pagination.getMeta(),
    }
  }

  public async index({ request, params }: HttpContextContract) {
    const filters = await request.validate({
      schema: schema.create({
        page: schema.number.optional(),
        limit: schema.number.optional(),
        showOriginalValues: schema.boolean.optional(),
      }),
    })

    const type = await ItemType.fetchByIdOrName(params.item_type_id).preload('fields').firstOrFail()

    const query = type
      .related('items')
      .query()
      .preload('origin')
      .preload('visibility')
      .preload('fields')

    const pagination = await query.paginate(filters.page || 1, filters.limit)

    const data = pagination.all().map((i) => {
      const fields = type.fields || []

      const metaValues = fields.map((f) => {
        const itemField = i.fields.find((m) => m.name === f.name)
        return { name: f.name, value: itemField ? itemField.serialize().value : undefined }
      })

      const originalValues = fields.map((f) => ({
        name: f.name,
        value: lodash.get(i.value, f.options.mapValue || f.name),
      }))

      const values = fields.reduce((all, f) => {
        const meta = metaValues.find((m) => m.name === f.name)
        const original = originalValues.find((o) => o.name === f.name)

        const currentValues = {
          ...all,
          [f.name]: meta?.value || original?.value,
        }

        if (filters.showOriginalValues && f.options.input?.editable) {
          return {
            ...currentValues,
            [`original:${f.name}`]: original?.value,
          }
        }

        return currentValues
      }, {})

      return {
        id: i.id,
        sourceId: i.sourceId,

        typeId: type.id,
        typeName: type.name,

        visibilityId: i.visibilityId,
        visibilityName: i.visibility.name,

        ...values,
      }
    })

    return {
      data,
      meta: pagination.getMeta(),
    }
  }

  public async show({ params, request }: HttpContextContract) {
    const filters = await request.validate({
      schema: schema.create({
        showOriginalValues: schema.boolean.optional(),
      }),
    })
    const type = await ItemType.fetchByIdOrName(params.item_type_id).preload('fields').firstOrFail()

    const item = await type
      .related('items')
      .query()
      .preload('visibility')
      .preload('origin')
      .preload('fields')
      .where('id', params.id)
      .firstOrFail()

    const fields = type.fields || []

    const metaValues = fields.map((f) => {
      const itemField = item.fields.find((m) => m.name === f.name)
      return { name: f.name, value: itemField ? itemField.serialize().value : undefined }
    })

    const originalValues = fields.map((f) => ({
      name: f.name,
      value: lodash.get(item.value, f.options.mapValue || f.name),
    }))

    const values = fields.reduce((all, f) => {
      const meta = metaValues.find((m) => m.name === f.name)
      const original = originalValues.find((o) => o.name === f.name)

      const currentValues = {
        ...all,
        [f.name]: meta?.value || original?.value,
      }

      if (filters.showOriginalValues && f.options.input?.editable) {
        return {
          ...currentValues,
          [`original:${f.name}`]: original?.value,
        }
      }

      return currentValues
    }, {})

    return {
      id: item.id,
      sourceId: item.sourceId,

      typeId: type.id,
      typeName: type.name,

      visibilityId: item.visibilityId,
      visibilityName: item.visibility.name,

      ...values,
    }
  }

  public async update({ params, request }: HttpContextContract) {
    const type = await ItemType.fetchByIdOrName(params.item_type_id).preload('fields').firstOrFail()
    const item = await Item.query().where('id', params.id).preload('fields').firstOrFail()

    const itemSchema = type.fields
      .filter((f) => f.options.input?.editable)
      .filter((f) => !['image', 'video'].includes(f.options.input?.type || ''))
      .reduce(
        (all, f) => ({
          ...all,
          [f.name]: schema.string.optional(),
        }),
        {}
      )

    const itemFileSchema: TypedSchema = type.fields
      .filter((f) => f.options.input?.editable)
      .filter((f) => ['image', 'video'].includes(f.options.input?.type || ''))
      .reduce(
        (all, f) => ({
          ...all,
          [f.name]: schema.file.optional(),
        }),
        {}
      )

    const itemFiles = await request.validate({
      schema: schema.create(itemFileSchema),
    })

    const normalFields = await request.validate({
      schema: schema.create({
        visibilityId: schema.number.optional(),
        ...itemSchema,
      }),
    })

    const normalFieldsToCreate = type.fields
      .filter((f) => f.options.input?.editable)
      .filter((f) => normalFields[f.name])
      .filter((f) => lodash.get(item.value, f.options.mapValue || '') !== normalFields[f.name])
      .map((f) => ({ name: f.name, value: normalFields[f.name] }))

    const normalFieldsToDelete = type.fields
      .filter((f) => normalFields[f.name] === null || !f.options.input?.editable)
      .map((f) => f.name)

    const fileFieldsToDelete = type.fields
      .filter((f) => ['image', 'video'].includes(f.options.input?.type || ''))
      .filter((f) => request.body()[f.name] !== undefined || itemFiles[f.name])
      .map((f) => item.fields.find((itemField) => itemField.name === f.name))

    await Promise.all(
      fileFieldsToDelete.map(async (itemField) => (itemField ? await itemField.delete() : null))
    )

    const uploadFiles = await Promise.all(
      Object.entries(itemFiles).map(async ([name, file]) => ({
        name,
        file: await File.upload(file),
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

    if (normalFields.visibilityId) {
      item.visibilityId = normalFields.visibilityId
    }

    await item.related('fields').query().delete().whereIn('name', normalFieldsToDelete)

    await item.related('fields').updateOrCreateMany(normalFieldsToCreate, ['name'])

    await item.save()

    return {
      status: 200,
      message: 'Item updated',
    }
  }
}
