import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import { schema, rules } from '@ioc:Adonis/Core/Validator'
import Item from 'App/Models/Item'
import Type from 'App/Models/Type'
import TypeField from 'App/Models/TypeField'

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
      .preload('metas')
      .paginate(filters.page || 1, filters.limit)

    const data = pagination.all().map((i) => i.serializeByType(type))

    return {
      meta: pagination.getMeta(),
      data,
    }
  }

  public async show({ params }: HttpContextContract) {
    const type = await Type.query().preload('fields').where('id', params.type_id).firstOrFail()

    const item = await Item.query()
      .preload('metas')
      .where('id', params.id)
      .where('typeId', params.type_id)
      .firstOrFail()

    return item.serializeByType(type)
  }

  public async store({ request, params }: HttpContextContract) {
    const type = await Type.query().preload('fields').where('id', params.type_id).firstOrFail()

    const fieldsSchema = {
      visibilityId: schema.number(),
    }

    type.fields
      .filter((f) => f.type === 'editable')
      .forEach((field) => {
        fieldsSchema[field.name] = schema.string()
      })

    const payload = await request.validate({
      schema: schema.create(fieldsSchema),
    })

    const item = await type.related('items').create({
      visibilityId: payload.visibilityId,
    })

    await item.related('metas').updateOrCreateMany(
      type.fields
        .filter((f) => f.type === 'editable')
        .map((f) => ({
          name: f.name,
          value: payload[f.name],
        }))
    )

    return {
      id: item.id,
      message: 'Item created',
    }
  }

  public async update({ request, params }: HttpContextContract) {
    const item = await Item.query()
      .where('id', params.id)
      .where('typeId', params.type_id)
      .firstOrFail()

    const editableFields = await TypeField.query()
      .where('typeId', params.type_id)
      .where('type', 'editable')

    const fieldsSchema = {}

    editableFields.forEach((field) => {
      fieldsSchema[field.name] = schema.string()
    })

    const payload = await request.validate({
      schema: schema.create(fieldsSchema),
    })

    await item.related('metas').updateOrCreateMany(
      Object.entries(payload).map(([key, value]) => ({
        name: key,
        value: value as any,
      }))
    )

    return {
      message: 'item updated',
    }
  }

  public async destroy({ params }: HttpContextContract) {
    const item = await Item.query()
      .where('id', params.id)
      .where('typeId', params.type_id)
      .firstOrFail()

    await item.delete()

    return {
      message: 'item deleted',
    }
  }
}
