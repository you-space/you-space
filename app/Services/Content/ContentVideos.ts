import Origin, { OriginTypes } from 'App/Models/Origin'
import { pickBy } from 'lodash'
import User from 'App/Models/User'
import Video from 'App/Models/Video'
import Visibility from 'App/Models/Visibility'
import OriginProvider from 'App/Services/Origin/OriginProvider'
import Permission from 'App/Models/Permission'

export interface VideoFilters {
  search?: string
  name?: string
  page: number
  limit: number
  visibility?: string
  originId?: string
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
      ...pickBy(args, (v) => v !== undefined),
    }

    const allowedVisibility = await this.getUserAllowedVisibilities(user)

    const visibilityId = allowedVisibility
      .filter((v) => {
        if (!filters.visibility) {
          return true
        }
        return filters.visibility.split(',').includes(v.name)
      })
      .map((v) => v.id)

    await ContentVideo.registerOrigins(filters.page)

    const query = Video.query()
      .leftJoin('video_metadata', 'video_metadata.video_id', 'videos.id')
      .preload('metadata')
      .preload('origin')
      .preload('views')
      .preload('visibility')
      .whereIn('visibility_id', visibilityId)
      .withCount('views', (query) => {
        query.sum('count').as('totalViews')
      })
      .orderBy(filters.orderBy[0], filters.orderBy[1])

    if (filters.search) {
      query.whereRaw(
        `setweight(to_tsvector(coalesce(videos.origin_data::text, '')), 'A')
        || setweight(to_tsvector(coalesce(video_metadata.title, '')), 'B')
        @@ plainto_tsquery(?)`,
        [filters.search]
      )
    }

    if (filters.originId) {
      query.whereIn('originId', filters.originId.split(','))
    }

    const paginator = await query.paginate(Number(filters.page), Number(filters.limit))

    const data = paginator.all().map((v) => {
      const serialize = OriginProvider.serializeVideo(v.origin, v)
      return {
        id: v.id,
        origin: v.origin.serialize({ fields: { omit: ['config'] } }),
        visibility: v.visibility,
        totalViews: Number(v.$extras.totalViews) || 0,

        title: v.title ? v.title : serialize.title,
        description: v.description ? v.description : serialize.description,

        thumbnailSrc: serialize.thumbnailSrc,
        src: serialize.src,
        viewsCount: serialize.viewsCount,
      }
    })

    return {
      data,
      meta: paginator.getMeta(),
    }
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
