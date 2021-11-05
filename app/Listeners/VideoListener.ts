import { schema, validator } from '@ioc:Adonis/Core/Validator'
import { string } from '@ioc:Adonis/Core/Helpers'

import Video from 'App/Models/Video'
import VideoIndexValidator from 'App/Validators/VideoIndexValidator'
import VideoStoreValidator from 'App/Validators/VideoStoreValidator'
import VideoUpdateValidator from 'App/Validators/VideoUpdateValidator'

export default class VideoListener {
  constructor(public permissions?: string[]) {}

  public async index(payload: any) {
    const filters = await validator.validate({
      ...new VideoIndexValidator(),
      data: payload || {},
    })

    const query = Video.query()

    if (this.permissions && !this.permissions.includes('admin')) {
      query.withScopes((s) =>
        s.isVisibleTo([...(this.permissions as string[]), 'visibility:public'])
      )
    }

    if (filters.id) {
      query.whereIn('id', filters.id)
    }

    if (filters.fields) {
      query.select(filters.fields.map(string.snakeCase))
    }

    if (filters.include?.includes('images')) {
      query.preload('images', (q) => q.select('id', 'name', 'src', 'alt'))
    }

    if (filters.include?.includes('views')) {
      query.preload('views', (q) => q.select('id', 'source', 'count'))
    }

    if (filters.include?.includes('comments')) {
      query.preload('comments')
    }

    query.orderBy(
      string.snakeCase(filters.orderBy || 'created_at'),
      filters.orderDesc ? 'desc' : 'asc'
    )

    const result = await query.paginate(filters.page || 1, filters.limit)

    return result.serialize()
  }

  public async show(payload: any) {
    const { id } = await validator.validate({
      schema: schema.create({
        id: schema.number(),
      }),
      data: payload || {},
    })

    const { data } = await this.index({
      ...payload,
      id: [id],
    })

    return data[0] || null
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
