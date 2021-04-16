import Application from '@ioc:Adonis/Core/Application'
import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import { v4 as uuid } from 'uuid'
import Database from '@ioc:Adonis/Lucid/Database'

import VideoValidator from 'App/Validators/VideoValidator'
import File, { FileTypes } from 'App/Models/File'
import VideoUpdateValidator from 'App/Validators/VideoUpdateValidator'

import OriginMain from '@ioc:Providers/OriginMain'
import EntityItem from 'App/Models/EntityItem'
import Entity from 'App/Models/Entity'

export default class VideosController {
  public async store({ request }: HttpContextContract) {
    const { title, video, description, thumbnail } = await request.validate(VideoValidator)

    const trx = await Database.transaction()

    const item = new EntityItem()

    const entityVideo = await Entity.firstOrCreate({
      name: 'video',
    })

    entityVideo.useTransaction(trx)

    const videoFile = new File()
    videoFile.useTransaction(trx)

    videoFile.filename = `${uuid()}.${video.extname}`
    videoFile.type = FileTypes.Video
    videoFile.extname = video.extname || 'mp4'

    await video.move(Application.tmpPath('uploads'), {
      name: videoFile.filename,
    })

    await videoFile.save()

    item.value = {
      id: videoFile.id,
      title: title,
      description: description,
      videoFileId: videoFile.id,
    }

    item.originId = OriginMain.id
    item.sourceId = String(videoFile.id)

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

      item.value.thumbnailId = thumbnailFile.id
    }

    await entityVideo.related('items').save(item)

    await trx.commit()

    return item
  }

  public async update({ request, params }: HttpContextContract) {
    const { title, description, thumbnail, visibilityId } = await request.validate(
      VideoUpdateValidator
    )

    // const originVideo = await Video.query().preload('metadata').where('id', params.id).firstOrFail()

    // const trx = await Database.transaction()
    // originVideo.useTransaction(trx)

    // if (visibilityId) {
    //   originVideo.visibilityId = visibilityId
    // }

    // if (thumbnail) {
    //   const old = await originVideo.metadata.related('thumbnailFile').query().first()
    //   await originVideo.metadata.related('thumbnailFile').dissociate()
    //   if (old) {
    //     await old.delete()
    //   }

    //   const thumbnailFile = new File()
    //   thumbnailFile.filename = `${uuid()}.${thumbnail.extname}`
    //   thumbnailFile.type = FileTypes.Image
    //   thumbnailFile.extname = thumbnail.extname || 'jpg'

    //   await originVideo.metadata.related('thumbnailFile').associate(thumbnailFile)

    //   await thumbnail.move(Application.tmpPath('uploads'), {
    //     name: thumbnailFile.filename,
    //   })
    // }

    // await originVideo.related('metadata').updateOrCreate(
    //   {
    //     videoId: originVideo.videoId,
    //   },
    //   { title, description }
    // )

    // await trx.commit()
  }

  public async destroy({ params }: HttpContextContract) {
    const video = await EntityItem.findOrFail(params.id)
    return video.delete()
  }
}
