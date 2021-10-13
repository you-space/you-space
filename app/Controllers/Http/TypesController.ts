import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import { schema, rules } from '@ioc:Adonis/Core/Validator'
import Space from 'App/Services/Space'
import TypeStoreValidator from 'App/Validators/TypeStoreValidator'

export default class TypesController {
  public async index({ request }: HttpContextContract) {
    const filters = await request.validate({
      schema: schema.create({
        page: schema.number.optional(),
        limit: schema.number.optional([rules.range(1, 40)]),
      }),
    })

    return await Space.emit('type:index', filters)
  }

  public async show({ params }: HttpContextContract) {
    return Space.emit('type:show', params.id)
  }

  public async store({ request }: HttpContextContract) {
    const payload = await request.validate(TypeStoreValidator)

    return Space.emit('type:store', payload)
  }

  public async destroy({ params }: HttpContextContract) {
    await Space.emit('type:destroy', params.id)

    return {
      message: 'Type deleted',
    }
  }
}
