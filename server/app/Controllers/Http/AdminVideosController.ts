import Application from '@ioc:Adonis/Core/Application'
import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import fs from 'fs'
import { promisify } from 'util'
import { v4 as uuid } from 'uuid'

import Video from 'App/Models/Video'
import VideoValidator from 'App/Validators/VideoValidator'
import Image from 'App/Models/Image'
import YouTubeProvider from '@ioc:Providers/YouTube'
import Origin from 'App/Models/Origin'
import { schema } from '@ioc:Adonis/Core/Validator'

export default class VideosController {
  public async index() {
    const origins = await Origin.query().where('type', 'you-tube')
    const videos = await Video.all()
    let youTubeVideos: any[] = []

    await Promise.all(
      origins.map(async (o) => {
        const originVideos = await YouTubeProvider.videos.index(o)
        youTubeVideos = youTubeVideos.concat(originVideos)
      })
    )

    return videos.concat(youTubeVideos)
  }

  public async store({ request }: HttpContextContract) {
    const { name, video, thumbnail } = await request.validate(VideoValidator)

    const videoFilename = `${uuid()}.${video.extname}`

    let imageId

    await video.move(Application.tmpPath('videos'), {
      name: videoFilename,
    })

    if (thumbnail) {
      const filenameThumbnail = `${uuid()}.${thumbnail.extname}`

      await thumbnail.move(Application.tmpPath('images'), {
        name: filenameThumbnail,
      })

      const image = await Image.create({
        filename: filenameThumbnail,
        extname: thumbnail.extname,
      })

      imageId = image.id
    }

    return Video.create({
      name: name,
      filename: videoFilename,
      imageId: imageId,
      extname: video.extname ? video.extname.replace('.', '') : undefined,
    })
  }

  public async show({ params, request }: HttpContextContract) {
    const { originId } = request.only(['originId'])
    if (!originId) {
      return await Video.findOrFail(params.id)
    }

    const origin = await Origin.findOrFail(originId)

    if (origin.type === 'you-tube') {
      return YouTubeProvider.videos.show(origin, params.id)
    }
  }

  public async destroy({ params }: HttpContextContract) {
    const video = await Video.findOrFail(params.id)
    const removeFile = promisify(fs.unlink)

    await removeFile(`${Application.tmpPath('videos')}/${video.filename}`)

    await video.delete()
  }
}
