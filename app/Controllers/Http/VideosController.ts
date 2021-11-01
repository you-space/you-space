import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import { extname } from 'path'
import Drive from '@ioc:Adonis/Core/Drive'

import Video from 'App/Models/Video'
import Space from 'App/Services/SpaceService'
import VideoUploadValidator from 'App/Validators/VideoUploadValidator'

export default class VideosController {
  public async index({ request }: HttpContextContract) {
    return Space.emit('video:index', request.qs())
  }

  public async show({ request, params }: HttpContextContract) {
    return Space.emit('video:show', {
      ...request.qs(),
      id: params.id,
    })
  }

  public async store({ request }: HttpContextContract) {
    return Space.emit('video:store', request.body())
  }

  public async update({ request, params }: HttpContextContract) {
    return Space.emit('video:update', {
      ...request.body(),
      id: params.id,
    })
  }

  public async destroy({ params }: HttpContextContract) {
    await Space.emit('video:destroy', params.id)

    return {
      message: 'Video deleted ',
    }
  }

  public async upload({ request }: HttpContextContract) {
    const { file, ...data } = await request.validate(VideoUploadValidator)

    await file.moveToDisk('./')

    const src = file.fileName

    return await Space.emit('video:store', {
      ...data,
      src,
      source: 'local',
    })
  }

  public async embed({ params, response }: HttpContextContract) {
    const video = await Video.findOrFail(params.id)

    if (video.source !== 'local') {
      return response.badRequest({
        message: 'Only local videos can be embedded',
      })
    }

    const exist = await Drive.exists(video.src)

    if (!exist) {
      return response.notFound({
        message: 'Video not found',
      })
    }

    const stream = await Drive.getStream(video.src)

    response.type(extname(video.src))

    response.stream(stream)
  }
}
