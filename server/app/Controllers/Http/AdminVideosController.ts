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
    const { name, video, thumbnail } = await request.validate(VideoValidator)

    const videoFilename = `${uuid()}.${video.extname}`
    let filenameThumbnail

    await video.move(Application.tmpPath('videos'), {
      name: videoFilename,
    })

    if (thumbnail) {
      filenameThumbnail = `${uuid()}.${video.extname}`
      await thumbnail.move(Application.tmpPath('thumbnails'), {
        name: filenameThumbnail,
      })
    }

    return Video.create({
      name: name,
      filename: videoFilename,
      filenameThumbnail: filenameThumbnail,
      extname: video.extname ? video.extname.replace('.', '') : undefined,
    })
  }

  public async show({ params, response }: HttpContextContract) {
    const video = await Video.findOrFail(params.id)

    const videoPath = `${Application.tmpPath('videos')}/${video.filename}`

    const readFile = promisify(fs.readFile)

    response.safeHeader('Content-type', `video/${video.extname}`)

    return readFile(videoPath)
  }

  public async destroy({ params }: HttpContextContract) {
    const video = await Video.findOrFail(params.id)
    const removeFile = promisify(fs.unlink)

    await removeFile(`${Application.tmpPath('videos')}/${video.filename}`)

    await video.delete()
  }
}
