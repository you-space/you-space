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
import Env from '@ioc:Adonis/Core/Env'

export default class VideosController {
  public async index({ request }: HttpContextContract) {
    const page = request.input('page', 1)
    const limit = 5
    const offset = (page - 1) * limit
    const origins = await Origin.query().where('type', OriginTypes.YouTube)
    let originsTotalItems = 0

    await Promise.all(
      origins.map(async (o) => {
        const { pageInfo } = await YoutubeProvider.videos.registerOriginVideosByPage(o, page)
        originsTotalItems += Number(pageInfo.totalResults)
      })
    )

    const { count } = await Video.query()
      .count('*')
      .whereNotIn(
        'origin_id',
        origins.map((o) => o.id)
      )
      .first()

    const videos = await Video.query().preload('origin').offset(offset).limit(limit)

    return {
      data: videos,
      meta: {
        total: Number(count) + originsTotalItems,
      },
    }
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

    let thumbnailSrc

    if (thumbnail) {
      const filenameThumbnail = `${uuid()}.${thumbnail.extname}`

      await thumbnail.move(Application.tmpPath('uploads'), {
        name: filenameThumbnail,
      })

      const image = await File.create({
        type: FileTypes.Image,
        filename: filenameThumbnail,
        extname: thumbnail.extname,
      })

      thumbnailSrc = `${Env.get('DOMAIN_URL', 'http://localhost:3333')}/v1/admin/files/embed/${
        image.id
      }`
    }

    return await Video.create({
      id: `${originMain.id}-${file.id}`,
      videoId: String(file.id),
      originId: originMain.id,
      name: name,
      thumbnailSrc,
      src: `${Env.get('DOMAIN_URL', 'http://localhost:3333')}/v1/admin/videos/embed/${file.id}`,
      originData: file.serialize(),
    })
  }

  public async show({ params, response }: HttpContextContract) {
    return Video.findOrFail(params.id)
  }

  public async embed({ params, response }: HttpContextContract) {
    const file = await File.findOrFail(params.id)

    const readFile = promisify(fs.readFile)

    const videoPath = `${Application.tmpPath('uploads')}/${file.filename}`

    response.safeHeader('Content-type', `video/${file.extname}`)

    return readFile(videoPath)
  }

  public async showFile({ params, response }: HttpContextContract) {
    const file = await File.findOrFail(params.id)

    const readFile = promisify(fs.readFile)

    const path = `${Application.tmpPath('uploads')}/${file.filename}`

    response.safeHeader('Content-type', `${file.type}/${file.extname}`)

    return readFile(path)
  }

  public async destroy({ params }: HttpContextContract) {
    const video = await Video.findOrFail(params.id)
    return video.delete()
  }
}
