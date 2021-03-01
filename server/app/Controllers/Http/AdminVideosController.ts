import Application from '@ioc:Adonis/Core/Application'
import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import fs from 'fs'
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

    const filename = `${uuid()}.${file.extname}`

    await file.move(Application.tmpPath('uploads'), {
      name: filename,
    })

    return Video.create({
      name: name,
      filename,
      extname: file.extname ? file.extname.replace('.', '') : undefined,
    })
  }

  public async show({ params, response }: HttpContextContract) {
    const video = await Video.findOrFail(params.id)

    const videoPath = `${Application.tmpPath('uploads')}/${video.filename}`

    const readFile = promisify(fs.readFile)

    response.safeHeader('Content-type', `video/${video.extname}`)

    return readFile(videoPath)
  }

  public async remove({ params }: HttpContextContract) {
    const video = await Video.findOrFail(params.id)
    const removeFile = promisify(fs.unlink)

    await removeFile(`${Application.tmpPath('uploads')}/${video.filename}`)

    await video.delete()
  }
}
