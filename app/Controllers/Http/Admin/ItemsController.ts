import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import { schema } from '@ioc:Adonis/Core/Validator'
import Item from 'App/Models/Item'

export default class ItemsController {
  public async index({ request }: HttpContextContract) {
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
}
