import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import { schema, rules } from '@ioc:Adonis/Core/Validator'
import Type from 'App/Models/Type'
import TypeStoreValidator from 'App/Validators/TypeStoreValidator'
import TypeUpdateValidator from 'App/Validators/TypeUpdateValidator'
import { DateTime } from 'luxon'

export default class TypesController {
  public async index({ request }: HttpContextContract) {
    const filters = await request.validate({
      schema: schema.create({
        page: schema.number.optional(),
        limit: schema.number.optional([rules.range(1, 40)]),
      }),
    })

    const query = Type.query()

    query.withScopes((s) => s.isNotDeleted())

    return query.paginate(filters.page || 1, filters.limit)
  }

  public async show({ params }: HttpContextContract) {
    return Type.findOrFail(params.id)
  }

  public async store({ request }: HttpContextContract) {
    const payload = await request.validate(TypeStoreValidator)

    return Type.create(payload)
  }

  public async update({ request, params }: HttpContextContract) {
    const type = await Type.findOrFail(params.id)

    const payload = await request.validate(TypeUpdateValidator)

    Object.assign(type, payload)

    await type.save()

    return {
      message: 'Type updated',
    }
  }

  public async destroy({ params }: HttpContextContract) {
    const type = await Type.findOrFail(params.id)

    type.deletedAt = DateTime.now()

    await type.save()

    return {
      message: 'Type deleted',
    }
  }
}
