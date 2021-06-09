import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import { types } from '@ioc:Adonis/Core/Helpers'
import ItemType from 'App/Models/ItemType'

export default class ItemTypesController {
  public async show({ params }: HttpContextContract) {
    if (types.isNumber(params.id)) {
      return await ItemType.query().where('id', params.id).whereNull('deletedAt').firstOrFail()
    }
    return await ItemType.query().where('name', params.id).whereNull('deletedAt').firstOrFail()
  }
}
