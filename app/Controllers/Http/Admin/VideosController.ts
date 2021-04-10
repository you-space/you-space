import Application from '@ioc:Adonis/Core/Application'
import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import { v4 as uuid } from 'uuid'
import Database from '@ioc:Adonis/Lucid/Database'

import Video from 'App/Models/Video'
import VideoValidator from 'App/Validators/VideoValidator'
import File, { FileTypes } from 'App/Models/File'
import ContentVideo from 'App/Services/Content/ContentVideos'
import VideoMetadata from 'App/Models/VideoMetadata'
import VideoUpdateValidator from 'App/Validators/VideoUpdateValidator'

import OriginMain from '@ioc:Providers/OriginMainProvider'

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

    const metadata = new VideoMetadata()

    metadata.title = title
    metadata.description = description
    metadata.videoFileId = videoFile.id

    localVideo.id = `${OriginMain.id}-${videoFile.id}`
    localVideo.videoId = String(videoFile.id)
    localVideo.originId = OriginMain.id

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

      metadata.thumbnailFileId = thumbnailFile.id
    }

    await localVideo.related('metadata').save(metadata)

    await trx.commit()

    return localVideo
  }

  public async update({ request, params }: HttpContextContract) {
    const { title, description, thumbnail, visibilityId } = await request.validate(
      VideoUpdateValidator
    )

    const originVideo = await Video.query().preload('metadata').where('id', params.id).firstOrFail()

    const trx = await Database.transaction()
    originVideo.useTransaction(trx)

    if (visibilityId) {
      originVideo.visibilityId = visibilityId
    }

    if (thumbnail) {
      const old = await originVideo.metadata.related('thumbnailFile').query().first()
      await originVideo.metadata.related('thumbnailFile').dissociate()
      if (old) {
        await old.delete()
      }

      const thumbnailFile = new File()
      thumbnailFile.filename = `${uuid()}.${thumbnail.extname}`
      thumbnailFile.type = FileTypes.Image
      thumbnailFile.extname = thumbnail.extname || 'jpg'

      await originVideo.metadata.related('thumbnailFile').associate(thumbnailFile)

      await thumbnail.move(Application.tmpPath('uploads'), {
        name: thumbnailFile.filename,
      })
    }

    await originVideo.related('metadata').updateOrCreate(
      {
        videoId: originVideo.videoId,
      },
      { title, description }
    )

    await trx.commit()
  }

  public async destroy({ params }: HttpContextContract) {
    const video = await Video.findOrFail(params.id)
    return video.delete()
  }
}
