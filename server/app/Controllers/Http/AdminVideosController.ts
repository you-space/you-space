import Application from '@ioc:Adonis/Core/Application'
import fs from 'fs'
import { promisify } from 'util'
import { v4 as uuid } from 'uuid'

import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'

import Video from 'App/Models/Video'
import VideoValidator from 'App/Validators/VideoValidator'
import File, { FileTypes } from 'App/Models/File'
import Origin, { OriginTypes } from 'App/Models/Origin'
import YoutubeProvider from '@ioc:Providers/YouTube'

export default class VideosController {
  public async index() {
    const origins = await Origin.query().where('type', OriginTypes.YouTube)

    await Promise.all(origins.map(async (o) => YoutubeProvider.videos.index(o)))

    return Video.all()
  }

  public async store({ request }: HttpContextContract) {
    const { name, video, thumbnail } = await request.validate(VideoValidator)

    const originMain = await Origin.firstOrCreate({
      type: OriginTypes.Main,
      name: 'local',
    })

    const videoFilename = `${uuid()}.${video.extname}`

    await video.move(Application.tmpPath('uploads'), {
      name: videoFilename,
    })

    const file = await File.create({
      type: FileTypes.Video,
      filename: videoFilename,
      extname: video.extname,
    })

    // if (thumbnail) {
    //   const filenameThumbnail = `${uuid()}.${thumbnail.extname}`

    //   await thumbnail.move(Application.tmpPath('uploads'), {
    //     name: filenameThumbnail,
    //   })

    //   const image = await Image.create({
    //     filename: filenameThumbnail,
    //     extname: thumbnail.extname,
    //   })

    //   imageId = image.id
    // }

    return Video.create({
      originId: originMain.id,
      videoId: String(file.id),
      originData: file.serialize(),
    })
  }

  public async show({ params, response }: HttpContextContract) {
    return await Video.findOrFail(params.id)
  }

  public async embed({ params, response }: HttpContextContract) {
    const video = await Video.findOrFail(params.id)
    // const origin = await video.related('origin')
    const file = await File.findOrFail(video.videoId)

    const readFile = promisify(fs.readFile)

    const videoPath = `${Application.tmpPath('uploads')}/${file.filename}`

    response.safeHeader('Content-type', `video/${file.extname}`)

    return readFile(videoPath)
  }
}
