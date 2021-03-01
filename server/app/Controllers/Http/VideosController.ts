import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import Application from '@ioc:Adonis/Core/Application'
import fs from 'fs'
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

    const videoPath = `${Application.tmpPath('uploads')}/${video.filename}`

    const readFile = promisify(fs.readFile)

    response.safeHeader('Content-type', `video/${video.extname}`)

    return readFile(videoPath)
  }
}
