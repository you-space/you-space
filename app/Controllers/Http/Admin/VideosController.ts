import Application from '@ioc:Adonis/Core/Application'
import { schema, rules } from '@ioc:Adonis/Core/Validator'
import { v4 as uuid } from 'uuid'

import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'

import Video from 'App/Models/Video'
import VideoValidator from 'App/Validators/VideoValidator'
import File, { FileTypes } from 'App/Models/File'
import ContentVideo from 'App/Services/Content/ContentVideos'
import OriginMain from '@ioc:Providers/OriginMainProvider'
import Database from '@ioc:Adonis/Lucid/Database'

export default class VideosController {
  public async index({ request, auth }: HttpContextContract) {
    const filter = {
      page: request.input('page', 1),
      limit: request.input('limit', 20),

      search: request.input('search', undefined),
      visibility: request.input('visibility', undefined),
      originId: request.input('originId', undefined),
    }

    return await ContentVideo.index(filter, auth.user)
  }

  public async store({ request }: HttpContextContract) {
    const { title, video, description, thumbnail } = await request.validate(VideoValidator)

    const trx = await Database.transaction()

    const localVideo = new Video()
    localVideo.useTransaction(trx)

    const videoFile = new File()
    videoFile.useTransaction(trx)

    videoFile.filename = `${uuid()}.${video.extname}`
    videoFile.type = FileTypes.Video
    videoFile.extname = video.extname || 'mp4'

    await video.move(Application.tmpPath('uploads'), {
      name: videoFile.filename,
    })

    await videoFile.save()

    localVideo.id = `${OriginMain.id}-${videoFile.id}`
    localVideo.videoId = String(videoFile.id)
    localVideo.originId = OriginMain.id
    localVideo.originData = {
      id: videoFile.id,
    }

    if (thumbnail) {
      const thumbnailFile = new File()
      thumbnailFile.useTransaction(trx)

      thumbnailFile.filename = `${uuid()}.${thumbnail.extname}`
      thumbnailFile.type = FileTypes.Image
      thumbnailFile.extname = thumbnail.extname || 'jpg'

      await thumbnail.move(Application.tmpPath('uploads'), {
        name: thumbnailFile.filename,
      })

      await thumbnailFile.save()

      localVideo.originData.thumbnailId = thumbnailFile.id
    }

    await localVideo.related('metadata').create({
      title,
      description,
    })

    await trx.commit()

    return localVideo
  }

  public async updateAll({ request }: HttpContextContract) {
    const { videos } = await request.validate({
      schema: schema.create({
        videos: schema.array([rules.minLength(1)]).members(
          schema.object().members({
            id: schema.string(),
            visibility_id: schema.number.optional(),
          })
        ),
      }),
    })

    return await Video.updateOrCreateMany('id', videos)
  }

  public async destroy({ params }: HttpContextContract) {
    const video = await Video.findOrFail(params.id)
    return video.delete()
  }
}
