import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import { schema, rules } from '@ioc:Adonis/Core/Validator'
import Type from 'App/Models/Type'
import TypeField from 'App/Models/TypeField'
import TypeFieldStoreValidator from 'App/Validators/TypeFieldStoreValidator'
import TypeFieldUpdateValidator from 'App/Validators/TypeFieldUpdateValidator'

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

  public async show({ params }: HttpContextContract) {
    return TypeField.query().where('typeId', params.type_id).where('id', params.id).firstOrFail()
  }

  public async store({ request, params }: HttpContextContract) {
    const type = await Type.findOrFail(params.type_id)

    const payload = await request.validate(TypeFieldStoreValidator)

    return type.related('fields').create({
      name: payload.name,
      type: payload.type as TypeField['type'],
      options: payload.options,
    })
  }

  public async update({ request, params }: HttpContextContract) {
    const field = await TypeField.query()
      .where('typeId', params.type_id)
      .andWhere('id', params.id)
      .firstOrFail()

    const payload = await request.validate(TypeFieldUpdateValidator)

    Object.assign(field, payload)

    await field.save()

    return {
      message: 'field updated',
    }
  }

  public async destroy({ params }: HttpContextContract) {
    const field = await TypeField.query()
      .where('typeId', params.type_id)
      .andWhere('id', params.id)
      .firstOrFail()

    await field.delete()

    return {
      message: 'field deleted',
    }
  }
}
