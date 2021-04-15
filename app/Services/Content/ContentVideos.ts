import Env from '@ioc:Adonis/Core/Env'
import { pickBy } from 'lodash'

import Origin, { OriginTypes } from 'App/Models/Origin'
import User from 'App/Models/User'
import Video from 'App/Models/Video'
import Visibility from 'App/Models/Visibility'
import Permission from 'App/Models/Permission'
import OriginService from '@ioc:Providers/OriginService'
import Redis from '@ioc:Adonis/Addons/Redis'

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
  public async importVideos(page: number) {
    const origins = await Origin.query().whereNot('type', OriginTypes.Main)

    await Promise.all(
      origins.map(async (o) => {
        const redisKey = `origin:${o.id}:videos:${page}`
        const cache = await Redis.get(redisKey)

        if (cache) {
          return
        }

        await OriginService.importVideos(o, page)

        await Redis.set(redisKey, 'true', 'EX', 60 * 60)
      })
    )
  }

  public async getUserAllowedVisibilities(user?: User) {
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

  public getVideoFields(video: Video) {
    const serialize = OriginService.serializeVideo(video.origin, video)
    return {
      id: video.id,

      origin: video.origin.serialize({ fields: { omit: ['config'] } }),
      originId: video.originId,
      originLink: serialize.originLink,
      originThumbnail: serialize.thumbnailSrc,

      videoId: video.videoId,

      visibilityId: video.visibilityId,
      visibilityName: video.visibility.name,

      totalViews: Number(video.$extras.totalViews) || 0,

      title: video.title ? video.title : serialize.title,
      description: video.description ? video.description : serialize.description,
      src: video.src ? video.src : serialize.src,
      link: `${Env.get('DOMAIN_URL')}/videos/${video.id}`,
      thumbnailSrc: video.thumbnailSrc ? video.thumbnailSrc : serialize.thumbnailSrc,
      publishedAt: serialize.publishedAt ? serialize.publishedAt : video.createdAt,

      viewsCount: serialize.viewsCount,
    }
  }

  public async index(args?: Partial<VideoFilters>, user?: User) {
    const filters: VideoFilters = {
      orderBy: ['created_at', 'desc'],
      ...pickBy(args, (v) => v !== undefined),
      page: args ? Number(args.page) : 1,
      limit: args ? Number(args.limit) : 20,
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

    await this.importVideos(filters.page)

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

    const data = paginator.all().map(this.getVideoFields)

    return {
      data,
      meta: paginator.getMeta(),
    }
  }

  public async show(videoId: string, user?: User) {
    const visibility = await this.getUserAllowedVisibilities(user)

    const video = await Video.query()
      .where('id', videoId)
      .preload('metadata')
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

    return this.getVideoFields(video)
  }
}
