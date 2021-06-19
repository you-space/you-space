import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import { schema } from '@ioc:Adonis/Core/Validator'
import { types } from '@ioc:Adonis/Core/Helpers'
import Item from 'App/Models/Item'
import ItemType from 'App/Models/ItemType'
import lodash from 'lodash'
import Logger from '@ioc:Adonis/Core/Logger'

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
      }),
    })

    const type = await ItemType.fetchByIdOrName(params.item_type_id).preload('fields').firstOrFail()

    const query = type.related('items').query().preload('visibility').preload('origin')

    const pagination = await query.paginate(filters.page || 1, filters.limit)

    const data = pagination.all().map((i) => {
      const fields = type.fields || []

      const values = fields.reduce((all, f) => {
        return {
          ...all,
          [f.name]: lodash.get(i.value, f.options.mapValue || f.name),
        }
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

  public async show({ params }: HttpContextContract) {
    const type = await ItemType.fetchByIdOrName(params.item_type_id).preload('fields').firstOrFail()

    const item = await type
      .related('items')
      .query()
      .preload('visibility')
      .preload('origin')
      .where('id', params.id)
      .firstOrFail()

    const fields = type.fields || []

    const values = fields.reduce((all, f) => {
      return {
        ...all,
        [f.name]: lodash.get(item.value, f.options.mapValue || f.name),
      }
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
}
