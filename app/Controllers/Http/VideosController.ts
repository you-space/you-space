import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import { extname } from 'path'
import Drive from '@ioc:Adonis/Core/Drive'

import Video from 'App/Models/Video'
import VideoUploadValidator from 'App/Validators/VideoUploadValidator'
import { Queue } from 'App/Queue'
import { cuid } from '@ioc:Adonis/Core/Helpers'
import VideoRepository from 'App/Repositories/VideoRepository'

export default class VideosController {
  constructor(public repository = VideoRepository) {}

  public async index({ request, auth }: HttpContextContract) {
    let permissions: string[] = []

    if (auth.user) {
      permissions = (await auth.user.findPermissions()).map((p) => p.name)
    }

    return this.repository.withPermissions(permissions).index(request.qs())
  }

  public async show({ request, response, auth, params }: HttpContextContract) {
    let permissions: string[] = []

    if (auth.user) {
      permissions = (await auth.user.findPermissions()).map((p) => p.name)
    }

    const video = await this.repository.withPermissions(permissions).show(params.id, request.qs())

    if (!video) {
      return response.notFound({
        message: 'Video not found',
      })
    }

    return video
  }

  public async store({ request }: HttpContextContract) {
    return this.repository.store(request.body())
  }

  public async update({ request, params }: HttpContextContract) {
    return this.repository.update(params.id, request.body())
  }

  public async destroy({ params }: HttpContextContract) {
    await this.repository.destroy(params.id)

    return {
      message: 'Video deleted ',
    }
  }

  public async upload({ request }: HttpContextContract) {
    const { file, ...data } = await request.validate(VideoUploadValidator)

    const filename = cuid() + extname(file.clientName)

    const src = filename

    Queue.addJob({
      queue: 'upload',
      jobId: `upload:${filename}`,
      args: {
        filename: filename,
        file,
      },
    })

    return await this.repository.store({
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
