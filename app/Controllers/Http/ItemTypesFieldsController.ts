import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import ItemType from 'App/Models/ItemType'

export default class ItemTypeFieldsController {
  public async index({ params }: HttpContextContract) {
    const type = await ItemType.fetchByIdOrName(params.item_type_id).preload('fields').firstOrFail()

    return type.fields.map(({ options, id, name }) => ({
      id: id,
      name: name,
      ...options,
    }))
  }
}
