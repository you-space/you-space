import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import fs from 'fs'
import path from 'path'
import { promisify } from 'util'

import Video from 'App/Models/Video'

export default class VideosController {
  public async userRecommendations() {
    return Video.all()
  }

  public async userSubscriptions() {
    return Video.all()
  }

  public async show({ params, response }: HttpContextContract) {
    const video = await Video.findOrFail(params.id)

    const readFile = promisify(fs.readFile)

    response.safeHeader('Content-type', `video/${path.extname(video.path).replace('.', '')}`)

    return readFile(video.path)
  }
}
