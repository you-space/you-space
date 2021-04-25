import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import YsOption, { BaseOptions } from 'App/Models/YsOption'
import ItemService from 'App/Services/ItemService'
import { schema } from '@ioc:Adonis/Core/Validator'

export default class VideosController {
  public async index({ request, auth }: HttpContextContract) {
    const option = await YsOption.firstOrCreate(
      { name: BaseOptions.EntityVideoNames },
      { name: BaseOptions.EntityVideoNames, value: '' }
    )

    const filters = await request.validate({
      schema: schema.create({
        page: schema.number.optional(),
        limit: schema.number.optional(),

        search: schema.string.optional(),
        visibility: schema.string.optional(),
        originId: schema.string.optional(),

        serializeItems: schema.boolean.optional(),
      }),
    })

    return await new ItemService().getItems(
      {
        ...filters,
        entity: option.value,
      },
      auth.user
    )

    // return await ContentService.index(filter, auth.user)
  }
}
