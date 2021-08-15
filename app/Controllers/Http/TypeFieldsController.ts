import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import { schema, rules } from '@ioc:Adonis/Core/Validator'
import Type from 'App/Models/Type'
import TypeFieldStoreValidator from 'App/Validators/TypeFieldStoreValidator'

export default class TypesController {
  public async index({ request, params }: HttpContextContract) {
    const type = await Type.findOrFail(params.type_id)

    const filters = await request.validate({
      schema: schema.create({
        page: schema.number.optional(),
        limit: schema.number.optional([rules.range(1, 40)]),
      }),
    })

    return type
      .related('fields')
      .query()
      .paginate(filters.page || 1, filters.limit)
  }

  public async store({ request, params }: HttpContextContract) {
    const type = await Type.findOrFail(params.type_id)

    const payload = await request.validate(TypeFieldStoreValidator)

    return type.related('fields').create(payload)
  }
}
