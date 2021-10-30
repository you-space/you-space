import { validator } from '@ioc:Adonis/Core/Validator'
import Image from 'App/Models/Image'
import ImageIndexValidator from 'App/Validators/ImageIndexValidator'
import ImageShowValidator from 'App/Validators/ImageShowValidator'
import ImageStoreValidator from 'App/Validators/ImageStoreValidator'
import ImageUpdateValidator from 'App/Validators/ImageUpdateValidator'

export default class ImageListener {
  public async index(payload: any) {
    const filters = await validator.validate({
      ...new ImageIndexValidator(),
      data: payload || {},
    })

    const query = Image.query()

    if (filters.fields) {
      query.select(filters.fields)
    }

    query.orderBy(filters.order_by || 'created_at', filters.order_desc ? 'desc' : 'asc')

    const result = await query.paginate(filters.page || 1, filters.limit)

    return result.serialize()
  }

  public async show(payload: any) {
    const filters = await validator.validate({
      ...new ImageShowValidator(),
      data: payload || {},
    })

    const query = Image.query()

    if (filters.fields) {
      query.select(filters.fields)
    }

    const image = await query.where('id', filters.id).firstOrFail()

    return image.serialize()
  }

  public async store(payload: any) {
    const data = await validator.validate({
      ...new ImageStoreValidator(),
      data: payload || {},
    })

    const image = await Image.create(data)

    return image.serialize()
  }

  public async update(payload: any) {
    const { id, ...data } = await validator.validate({
      schema: new ImageUpdateValidator().schema,
      data: payload || {},
    })

    const image = await Image.findOrFail(id)

    image.merge(data)

    await image.save()

    return image.serialize()
  }

  public async destroy(id: number) {
    const image = await Image.findOrFail(id)

    await image.delete()
  }
}
