import Origin, { OriginTypes } from 'App/Models/Origin'
import { pickBy } from 'lodash'
import User from 'App/Models/User'
import Video from 'App/Models/Video'
import Visibility from 'App/Models/Visibility'
import OriginProvider from 'App/Services/Origin/OriginProvider'
import Permission from 'App/Models/Permission'

export interface VideoFilters {
  name?: string
  page: number
  limit: number
  visibility: Visibility['name']
  orderBy: [string, 'desc' | 'asc']
}

export default class ContentVideo {
  static async registerOrigins(page: number) {
    const origins = await Origin.query().where('type', OriginTypes.YouTube)

    await Promise.all(origins.map(async (o) => OriginProvider.registerVideos(o, page)))
  }

  static async getUserAllowedVisibilities(user?: User) {
    const allVisibility = await Visibility.query().preload('requiredPermissions')

    if (!user) {
      return allVisibility.filter((v) => v.name === 'public')
    }

    const roles = await user.related('roles').query().preload('permissions')

    const usersPermission = roles
      .map((r) => r.permissions)
      .reduce<Permission[]>((all, p) => all.concat(p), [])
      .map((p) => p.name)

    const allowedVisibilities = allVisibility.filter((v) => {
      const requiredPermissions = v.requiredPermissions.map((p) => p.name)

      if (requiredPermissions.length === 0) {
        return true
      }
      return requiredPermissions.every((rp) => usersPermission.includes(rp))
    })

    return allowedVisibilities
  }

  static async index(args?: Partial<VideoFilters>, user?: User) {
    const filters: VideoFilters = {
      page: 1,
      limit: 20,
      orderBy: ['created_at', 'desc'],
      visibility: 'public',
      ...pickBy(args, (v) => v !== undefined),
    }

    const allowedVisibility = await this.getUserAllowedVisibilities(user)

    const visibilityId = allowedVisibility
      .filter((v) => filters.visibility.split(',').includes(v.name))
      .map((v) => v.id)

    const offset = (filters.page - 1) * filters.limit

    await ContentVideo.registerOrigins(filters.page)

    const videos = await Video.query()
      .preload('origin')
      .preload('views')
      .preload('visibility')
      .whereIn('visibility_id', visibilityId)
      .withCount('views', (query) => {
        query.sum('count').as('totalViews')
      })
      .offset(offset)
      .limit(filters.limit)
      .orderBy(filters.orderBy[0], filters.orderBy[1])

    const serialize = videos.map((v) => ({
      id: v.id,
      ...OriginProvider.serializeVideo(v.origin, v),
      origin: v.origin.serialize({ fields: { omit: ['config'] } }),
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
      origin: video.origin.serialize({ fields: { omit: ['config'] } }),
      visibility: video.visibility,
      totalViews: Number(video.$extras.totalViews) || 0,
    }
  }
}
