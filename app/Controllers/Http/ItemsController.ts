import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import { schema, rules } from '@ioc:Adonis/Core/Validator'
import Item from 'App/Models/Item'
import ItemStoreValidator from 'App/Validators/ItemStoreValidator'
import ItemUpdateValidator from 'App/Validators/ItemUpdateValidator'

export default class ItemsController {
  public async index({ request }: HttpContextContract) {
    const filters = await request.validate({
      schema: schema.create({
        page: schema.number.optional(),
        limit: schema.number.optional([rules.range(1, 40)]),
      }),
    })

    return await Item.query()
      .preload('type', (q) => q.select('name'))
      .preload('visibility', (q) => q.select('name'))
      .paginate(filters.page || 1, filters.limit)
  }

  public async store({ request }: HttpContextContract) {
    const payload = await request.validate(ItemStoreValidator)

    return await Item.create(payload)
  }

  public async update({ request, params }: HttpContextContract) {
    const item = await Item.findOrFail(params.id)

    const payload = await request.validate(ItemUpdateValidator)

    Object.assign(item, payload)

    await item.save()

    return {
      message: 'item updated',
    }
  }
}
