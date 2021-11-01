import { validator } from '@ioc:Adonis/Core/Validator'
import Video from 'App/Models/Video'
import VideoIndexValidator from 'App/Validators/VideoIndexValidator'
import VideoShowValidator from 'App/Validators/VideoShowValidator'
import VideoStoreValidator from 'App/Validators/VideoStoreValidator'
import VideoUpdateValidator from 'App/Validators/VideoUpdateValidator'

export default class VideoListener {
  public async index(payload: any) {
    const filters = await validator.validate({
      ...new VideoIndexValidator(),
      data: payload || {},
    })

    const query = Video.query()

    if (filters.fields) {
      query.select([...filters.fields, 'id'].map((f) => `videos.${f}`))
    }

    if (filters.include?.includes('images')) {
      query.preload('images', (q) => q.select('id', 'name', 'src', 'alt'))
    }

    query.orderBy(filters.order_by || 'created_at', filters.order_desc ? 'desc' : 'asc')

    const result = await query.paginate(filters.page || 1, filters.limit)

    return result.serialize()
  }

  public async show(payload: any) {
    const filters = await validator.validate({
      ...new VideoShowValidator(),
      data: payload || {},
    })

    const query = Video.query()

    if (filters.fields) {
      query.select(filters.fields)
    }

    const video = await query.where('id', filters.id).firstOrFail()

    return video.serialize()
  }

  public async store(payload: any) {
    const data = await validator.validate({
      ...new VideoStoreValidator(),
      data: payload || {},
    })

    const video = await Video.create(data)

    return video.serialize()
  }

  public async update(payload: any) {
    const { id, ...data } = await validator.validate({
      ...new VideoUpdateValidator(),
      data: payload || {},
    })

    const video = await Video.findOrFail(id)

    video.merge(data)

    await video.save()

    return video.serialize()
  }

  public async destroy(id: number) {
    const video = await Video.findOrFail(id)

    const images = await video.related('images').query()

    await Promise.all(images.map((image) => image.delete()))

    await video.delete()
  }
}
