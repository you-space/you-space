import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import { schema, rules } from '@ioc:Adonis/Core/Validator'
import Type from 'App/Models/Type'

export default class TypeItemsController {
  public async index({ request, params }: HttpContextContract) {
    const type = await Type.query().preload('fields').where('id', params.type_id).firstOrFail()

    const filters = await request.validate({
      schema: schema.create({
        page: schema.number.optional(),
        limit: schema.number.optional([rules.range(1, 40)]),
      }),
    })

    const pagination = await type
      .related('items')
      .query()
      .paginate(filters.page || 1, filters.limit)

    const data = pagination.all().map((i) => i.serializeByType(type))

    return {
      meta: pagination.getMeta(),
      data,
    }
  }
}
