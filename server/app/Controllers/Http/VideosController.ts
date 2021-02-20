import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'

import Video from 'App/Models/Video'
import VideoValidator from 'App/Validators/VideoValidator'

export default class VideosController {
  public async index() {
    return Video.all()
  }
  public async create({ request }: HttpContextContract) {
    const data = await request.validate(VideoValidator)

    return Video.create({
      name: data.name,
      path: data.path,
    })
  }
}
