import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import { schema } from '@ioc:Adonis/Core/Validator'
import { types } from '@ioc:Adonis/Core/Helpers'
import Item from 'App/Models/Item'
import ItemType from 'App/Models/ItemType'
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
      .preload('metas')

    const pagination = await query.paginate(filters.page || 1, filters.limit)

    const data = pagination.all().map((i) => {
      const fields = type.fields || []

      const metaValues = fields.map((f) => {
        const meta = i.metas.find((m) => m.name === f.name)
        return { name: f.name, value: meta?.value }
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
      .preload('metas')
      .where('id', params.id)
      .firstOrFail()

    const fields = type.fields || []

    const metaValues = fields.map((f) => {
      const meta = item.metas.find((m) => m.name === f.name)
      return { name: f.name, value: meta?.value }
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
    const body = request.all()
    const type = await ItemType.fetchByIdOrName(params.item_type_id).preload('fields').firstOrFail()
    const item = await Item.findOrFail(params.id)

    const trx = await Database.transaction()

    item.useTransaction(trx)

    const metasToDelete = type.fields
      .filter((f) => body[f.name] === null || !f.options.input?.editable)
      .map((f) => f.name)

    const metasToCreate = type.fields
      .filter((f) => f.options.input?.editable)
      .filter((f) => body[f.name])
      .filter((f) => lodash.get(item.value, f.options.mapValue || '') !== body[f.name])
      .map((f) => ({ name: f.name, value: body[f.name] }))

    if (body.visibilityId) {
      item.visibilityId = body.visibilityId
    }

    await item.related('metas').query().delete().whereIn('name', metasToDelete)

    await item.related('metas').updateOrCreateMany(metasToCreate, ['name'])

    await trx.commit()
  }
}
