import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import { schema, rules } from '@ioc:Adonis/Core/Validator'
import Item from 'App/Models/Item'
import ItemStoreValidator from 'App/Validators/ItemStoreValidator'

export default class ItemsController {
  public async index({ request }: HttpContextContract) {
    const filters = await request.validate({
      schema: schema.create({
        page: schema.number.optional(),
        limit: schema.number.optional([rules.range(1, 40)]),
      }),
    })

    return Item.query().paginate(filters.page || 1, filters.limit)
  }

  public async store({ request }: HttpContextContract) {
    const payload = await request.validate(ItemStoreValidator)

    return await Item.create(payload)
  }
}
