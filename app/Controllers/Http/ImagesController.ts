import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import Image from 'App/Models/Image'
import ImagesIndexValidator from 'App/Validators/ImagesIndexValidator'

export default class ImagesController {
  public async index({ request }: HttpContextContract) {
    const filters = await request.validate(ImagesIndexValidator)

    const query = Image.query()

    if (filters.fields) {
      query.select(filters.fields)
    }

    return await query.paginate(filters.page || 1, filters.limit)
  }
}
