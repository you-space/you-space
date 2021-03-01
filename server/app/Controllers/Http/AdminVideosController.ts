import Application from '@ioc:Adonis/Core/Application'
import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import fs from 'fs'
import path from 'path'
import { promisify } from 'util'
import { v4 as uuid } from 'uuid'

import Video from 'App/Models/Video'
import VideoValidator from 'App/Validators/VideoValidator'

export default class VideosController {
  public async index() {
    return Video.all()
  }

  public async store({ request }: HttpContextContract) {
    const { name, file } = await request.validate(VideoValidator)
    const fileName = `${uuid()}.${file.extname}`
    await file.move(Application.tmpPath('uploads'), {
      name: fileName,
    })

    return Video.create({
      name: name,
      path: `${Application.tmpPath('uploads')}/${fileName}`,
      extname: file.extname,
    })
  }

  public async show({ params, response }: HttpContextContract) {
    const video = await Video.findOrFail(params.id)

    const readFile = promisify(fs.readFile)

    response.safeHeader('Content-type', `video/${path.extname(video.path).replace('.', '')}`)

    return readFile(video.path)
  }

  public async remove({ params }: HttpContextContract) {
    const video = await Video.findOrFail(params.id)
    const removeFile = promisify(fs.unlink)

    await removeFile(video.path)

    await video.delete()
  }
}
