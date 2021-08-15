import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import { schema, rules } from '@ioc:Adonis/Core/Validator'
import Type from 'App/Models/Type'
import TypeStoreValidator from 'App/Validators/TypeStoreValidator'

export default class TypesController {
  public async index({ request }: HttpContextContract) {
    const filters = await request.validate({
      schema: schema.create({
        page: schema.number.optional(),
        limit: schema.number.optional([rules.range(1, 40)]),
      }),
    })

    return Type.query().paginate(filters.page || 1, filters.limit)
  }

  public async store({ request }: HttpContextContract) {
    const payload = await request.validate(TypeStoreValidator)

    return Type.create(payload)
  }
}
