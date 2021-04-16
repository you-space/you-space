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

    const entityVideo = await Entity.firstOrCreate({
      name: 'video',
    })

    const item = new EntityItem()
    const videoFile = new File()

    videoFile.useTransaction(trx)
    item.useTransaction(trx)

    item.entityId = entityVideo.id

    videoFile.filename = `${uuid()}.${video.extname}`
    videoFile.type = FileTypes.Video
    videoFile.extname = video.extname || 'mp4'

    await video.move(Application.tmpPath('uploads'), {
      name: videoFile.filename,
    })

    await videoFile.save()

    item.originId = OriginMain.id
    item.sourceId = String(videoFile.id)

    const metas = [
      {
        name: 'title',
        value: title,
      },
      {
        name: 'description',
        value: description,
      },
      {
        name: 'fileId',
        value: String(videoFile.id),
      },
    ]

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

      metas.push({
        name: 'thumbnailId',
        value: String(thumbnailFile.id),
      })
    }

    await item.related('metas').createMany(metas)

    await trx.commit()

    return item
  }

  public async update({ request, params }: HttpContextContract) {
    const { title, description, thumbnail, visibilityId } = await request.validate(
      VideoUpdateValidator
    )

    const item = await EntityItem.query().preload('metas').where('id', params.id).firstOrFail()
    const newMetas: any[] = []

    const trx = await Database.transaction()
    item.useTransaction(trx)

    if (visibilityId) {
      item.visibilityId = visibilityId
    }

    if (thumbnail) {
      const old = item.metas.find((m) => m.name === 'thumbnailId')
      const file = await File.find(old ? old.value : null)

      if (file) {
        await file.delete()
      }

      const thumbnailFile = new File()
      thumbnailFile.useTransaction(trx)

      thumbnailFile.filename = `${uuid()}.${thumbnail.extname}`
      thumbnailFile.type = FileTypes.Image
      thumbnailFile.extname = thumbnail.extname || 'jpg'

      await thumbnailFile.save()

      newMetas.push({
        name: 'thumbnailId',
        value: thumbnailFile.id,
      })

      await thumbnail.move(Application.tmpPath('uploads'), {
        name: thumbnailFile.filename,
      })
    }

    if (title) {
      newMetas.push({
        name: 'title',
        value: title,
      })
    }

    if (description) {
      newMetas.push({
        name: 'description',
        value: description,
      })
    }

    await item.related('metas').updateOrCreateMany(newMetas, 'name')

    await trx.commit()
  }

  public async destroy({ params }: HttpContextContract) {
    const video = await EntityItem.findOrFail(params.id)
    return video.delete()
  }
}
