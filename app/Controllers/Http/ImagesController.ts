import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import Drive from '@ioc:Adonis/Core/Drive'
import { extname } from 'path'
import Image from 'App/Models/Image'
import Space from 'App/Services/SpaceService'
import ImageUploadValidator from 'App/Validators/ImageUploadValidator'

export default class ImagesController {
  public async index({ request }: HttpContextContract) {
    return Space.emit('image:index', request.qs())
  }

  public async show({ request, params }: HttpContextContract) {
    return Space.emit<Image>('image:show', {
      id: params.id,
      ...request.qs(),
    })
  }

  public async store({ request }: HttpContextContract) {
    return Space.emit('image:store', request.body())
  }

  public async update({ request, params }: HttpContextContract) {
    return Space.emit<Image>('image:update', {
      id: params.id,
      ...request.body(),
    })
  }

  public async destroy({ params }: HttpContextContract) {
    await Space.emit('image:destroy', params.id)

    return {
      message: 'Image deleted',
    }
  }

  public async upload({ request }: HttpContextContract) {
    const { file, ...data } = await request.validate(ImageUploadValidator)

    await file.moveToDisk('./')

    const src = file.fileName

    return await Space.emit<Image>('image:store', {
      ...data,
      src,
      source: 'local',
    })
  }

  public async embed({ response, params }: HttpContextContract) {
    const image = await Space.emit<Image>('image:show', { id: params.id })

    if (!image) {
      return response.notFound({
        message: 'Image not found',
      })
    }

    if (image.source !== 'local') {
      return response.badRequest({
        message: 'Only local images can be embedded',
      })
    }

    const exist = await Drive.exists(image.src)

    if (!exist) {
      return response.notFound({
        message: 'Image not found',
      })
    }

    const { size } = await Drive.getStats(image.src)

    response.type(extname(image.src))
    response.header('content-length', size)

    return response.stream(await Drive.getStream(image.src))
  }
}
