import Application from '@ioc:Adonis/Core/Application'
import { schema, rules } from '@ioc:Adonis/Core/Validator'
import { v4 as uuid } from 'uuid'

import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'

import Video from 'App/Models/Video'
import VideoValidator from 'App/Validators/VideoValidator'
import File, { FileTypes } from 'App/Models/File'
import OriginMetadata from 'App/Models/OriginMetadata'
import ContentVideo from 'App/Services/Content/ContentVideos'
import OriginMain from '@ioc:Providers/OriginMainProvider'

export default class VideosController {
  public async index({ request, auth }: HttpContextContract) {
    const filter = {
      page: request.input('page', 1),
      limit: request.input('limit', 20),
    }

    const { sum } = await OriginMetadata.query().sum('total_videos').first()
    const totalVideos = Number(sum) || 0

    const videos = await ContentVideo.index(filter, auth.user)

    return {
      data: videos,
      meta: {
        total: totalVideos,
        pages: Math.ceil(totalVideos / filter.limit),
      },
    }
  }

  public async store({ request }: HttpContextContract) {
    const { name, video, thumbnail } = await request.validate(VideoValidator)

    const videoFilename = `${uuid()}.${video.extname}`

    await video.move(Application.tmpPath('uploads'), {
      name: videoFilename,
    })

    const file = await File.create({
      type: FileTypes.Video,
      filename: videoFilename,
      extname: video.extname,
    })

    let image: File | null = null

    if (thumbnail) {
      const filenameThumbnail = `${uuid()}.${thumbnail.extname}`

      await thumbnail.move(Application.tmpPath('uploads'), {
        name: filenameThumbnail,
      })

      image = await File.create({
        type: FileTypes.Image,
        filename: filenameThumbnail,
        extname: thumbnail.extname,
      })
    }

    const create = await Video.create({
      id: `${OriginMain.id}-${file.id}`,
      videoId: String(file.id),
      originId: OriginMain.id,
      originData: {
        ...file.serialize(),
        name,
        thumbnail: image ? image.serialize() : undefined,
      },
    })

    const { count } = await OriginMain.related('videos').query().count('id').first()

    await OriginMain.related('metadata').updateOrCreate(
      {
        originId: OriginMain.id,
      },
      { originId: OriginMain.id, totalVideos: count }
    )

    return create
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
