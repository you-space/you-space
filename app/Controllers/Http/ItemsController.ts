import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import { schema, rules } from '@ioc:Adonis/Core/Validator'
import ItemsManager from 'App/Extensions/Utils/ItemsManager'
import Item from 'App/Models/Item'
import ItemStoreValidator from 'App/Validators/ItemStoreValidator'
import ItemUpdateValidator from 'App/Validators/ItemUpdateValidator'

export default class ItemsController {
  public async index({ request }: HttpContextContract) {
    const { serialize, ...filters } = await request.validate({
      schema: schema.create({
        page: schema.number.optional(),
        limit: schema.number.optional([rules.range(1, 40)]),

        serialize: schema.boolean.optional(),

        search: schema.string.optional(),
      }),
    })

    const manager = new ItemsManager()

    return manager.fetchItems(filters, serialize)
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
