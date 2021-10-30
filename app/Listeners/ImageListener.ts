import { validator } from '@ioc:Adonis/Core/Validator'
import Image from 'App/Models/Image'
import ImageIndexValidator from 'App/Validators/ImageIndexValidator'
import ImageShowValidator from 'App/Validators/ImageShowValidator'
import ImageStoreValidator from 'App/Validators/ImageStoreValidator'
import ImageUpdateValidator from 'App/Validators/ImageUpdateValidator'

export default class ImageListener {
  public async index(payload: any) {
    const filters = await validator.validate({
      schema: new ImageIndexValidator().schema,
      data: payload || {},
    })

    const query = Image.query()

    if (filters.fields) {
      query.select(filters.fields)
    }

    return await query.paginate(filters.page || 1, filters.limit)
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

    return query.where('id', filters.id).firstOrFail()
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

    const image = await this.show({ id })

    image.merge(data)

    await image.save()

    return image.serialize()
  }

  public async destroy(id: number) {
    const image = await this.show({ id })

    await image.delete()
  }
}
