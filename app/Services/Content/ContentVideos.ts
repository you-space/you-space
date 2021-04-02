import Origin, { OriginTypes } from 'App/Models/Origin'
import { pickBy } from 'lodash'
import User from 'App/Models/User'
import Video from 'App/Models/Video'
import Visibility from 'App/Models/Visibility'
import OriginProvider from 'App/Services/Origin/OriginProvider'

export interface VideoFilters {
  name?: string
  page: number
  limit: number
  visibility: number
  orderBy: [string, 'desc' | 'asc']
}

export default class ContentVideo {
  static async registerOrigins(page: number) {
    const origins = await Origin.query().where('type', OriginTypes.YouTube)

    await Promise.all(origins.map(async (o) => OriginProvider.registerVideos(o, page)))
  }

  static async getUserAllowedVisibilities(user?: User) {
    const allVisibility = await Visibility.all()

    if (!user) {
      return allVisibility.filter((v) => v.name === 'public')
    }

    const roles = await user.related('roles').query()

    if (roles.some((r) => r.name === 'admin')) {
      return allVisibility
    }

    return allVisibility.filter((v) => v.name === 'public')
  }

  static async index(args?: Partial<VideoFilters>, user?: User) {
    const filters: VideoFilters = {
      page: 1,
      limit: 20,
      orderBy: ['created_at', 'desc'],
      visibility: 1,
      ...pickBy(args, (v) => v !== undefined),
    }

    const visibility = await this.getUserAllowedVisibilities(user)

    const offset = (filters.page - 1) * filters.limit

    await ContentVideo.registerOrigins(filters.page)

    const videos = await Video.query()
      .preload('origin')
      .preload('views')
      .preload('visibility')
      .whereIn(
        'visibility_id',
        visibility.map((v) => v.id)
      )
      .withCount('views', (query) => {
        query.sum('count').as('totalViews')
      })
      .offset(offset)
      .limit(filters.limit)
      .orderBy(filters.orderBy[0], filters.orderBy[1])

    const serialize = videos.map((v) => ({
      id: v.id,
      ...OriginProvider.serializeVideo(v.origin, v),
      origin: v.origin,
      visibility: v.visibility,
      totalViews: Number(v.$extras.totalViews) || 0,
    }))

    return serialize
  }

  static async show(videoId: string, user?: User) {
    const visibility = await this.getUserAllowedVisibilities(user)

    const video = await Video.query()
      .where('id', videoId)
      .preload('origin')
      .preload('views')
      .preload('visibility')
      .whereIn(
        'visibility_id',
        visibility.map((v) => v.id)
      )
      .withCount('views', (query) => {
        query.sum('count').as('totalViews')
      })
      .firstOrFail()

    return {
      id: video.id,
      ...OriginProvider.serializeVideo(video.origin, video),
      origin: video.origin,
      visibility: video.visibility,
      totalViews: Number(video.$extras.totalViews) || 0,
    }
  }
}
