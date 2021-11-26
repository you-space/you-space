import { validator } from '@ioc:Adonis/Core/Validator'
import { string } from '@ioc:Adonis/Core/Helpers'

import Video from 'App/Models/Video'
import VideoIndexValidator from 'App/Validators/VideoIndexValidator'
import BaseRepository from './BaseRepository'
import VideoStoreValidator from 'App/Validators/VideoStoreValidator'
import VideoUpdateValidator from 'App/Validators/VideoUpdateValidator'
import VideoCreateManyValidator from 'App/Validators/VideoCreateManyValidator'
import VideoThumbnailsValidator from 'App/Validators/VideoThumbnailsValidator'
import Image from 'App/Models/Image'

export class VideoRepository extends BaseRepository {
  public async index(payload: any) {
    const filters = await validator.validate({
      ...new VideoIndexValidator(),
      data: payload || {},
    })

    const query = Video.query().preload('permission')

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

    if (this.permissions && !this.permissions.includes('admin')) {
      query.withScopes((s) =>
        s.isVisibleTo([...(this.permissions as string[]), 'visibility:public'])
      )
    }

    const pagination = await query.paginate(filters.page || 1, filters.limit)

    return pagination.serialize()
  }

  public async show(id: number, filters?: any) {
    const { data } = await this.index({
      ...filters,
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

  public async update(id: number, payload: any) {
    const data = await validator.validate({
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

  public async createMany(payload: string) {
    const { videos } = await validator.validate({
      ...new VideoCreateManyValidator(),
      data: { videos: payload },
    })

    await Video.updateOrCreateMany(
      ['sourceId', 'source'],
      videos.map((v) => ({
        sourceId: v.videoId,
        source: v.source,
        title: v.title,
        description: v.description,
        src: v.src,
      }))
    )
  }

  public async createThumbnails(payload: any) {
    const { images } = await validator.validate({
      ...new VideoThumbnailsValidator(),
      data: { images: payload },
    })

    const videoIds = images.map((image) => image.videoId)

    const videos = await Video.query().whereIn('sourceId', videoIds)

    const imagesWithVideo = images
      .filter((img) => videos.find((v) => v.sourceId === img.videoId))
      .map((img) => ({
        ...img,
        videoId: videos.find((v) => v.sourceId === img.videoId)?.id,
        name: `thumbnail:${img.name}`,
      }))

    await Image.updateOrCreateMany(['source', 'videoId', 'name'], imagesWithVideo)
  }
}

export default new VideoRepository()
