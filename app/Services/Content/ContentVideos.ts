import Env from '@ioc:Adonis/Core/Env'
import { pickBy } from 'lodash'

import User from 'App/Models/User'
import Visibility from 'App/Models/Visibility'
import Permission from 'App/Models/Permission'
import OriginService from '@ioc:Providers/OriginService'
import Entity from 'App/Models/Entity'

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

  public getVideoFields(video: EntityItem) {
    const serialize = OriginService.serializeVideo(video.origin, video)

    const metas = video.metas.reduce(
      (all, meta) => ({
        ...all,
        [meta.name]: meta.value,
      }),
      {}
    )
    if (metas['thumbnailId']) {
      metas['thumbnailSrc'] = `/api/v1/files/embed/${metas['thumbnailId']}`
    }

    if (metas['fileId']) {
      metas['src'] = `/api/v1/files/embed/${metas['fileId']}`
    }

    return {
      id: video.id,

      originName: video.origin.name,
      originId: video.originId,
      originLink: serialize.originLink,
      originThumbnail: serialize.thumbnailSrc,

      videoId: video.sourceId,

      visibilityId: video.visibilityId,
      visibilityName: video.visibility.name,

      title: metas['title'] || serialize.title,
      description: metas['description'] || serialize.description,
      src: metas['src'] || serialize.src,
      thumbnailSrc: metas['thumbnailSrc'] || serialize.thumbnailSrc,

      link: `${Env.get('DOMAIN_URL')}/videos/${video.id}`,
      publishedAt: serialize.publishedAt ? serialize.publishedAt : video.createdAt,

      viewsCount: serialize.viewsCount || 0,
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

    const entityVideo = await Entity.firstOrCreate({
      name: 'video',
    })

    const query = entityVideo
      .related('items')
      .query()
      .select('entity_items.*')
      .leftJoin('entity_item_metas', 'entity_item_metas.entity_item_id', 'entity_items.id')
      .preload('metas')
      .preload('origin')
      .preload('visibility')
      .whereIn('visibility_id', visibilityId)
      .orderBy(filters.orderBy[0], filters.orderBy[1])
      .groupBy('entity_items.id')

    if (filters.search) {
      query.whereRaw(
        `setweight(to_tsvector(coalesce(entity_items.value::text, '')), 'A')
        || setweight(to_tsvector(coalesce(entity_item_metas.value, '')), 'B')
        @@ plainto_tsquery(?)`,
        [filters.search]
      )
    }

    if (filters.originId) {
      query.whereIn('originId', filters.originId.split(','))
    }

    const paginator = await query.paginate(filters.page, filters.limit)

    const data = paginator.all().map(this.getVideoFields)

    return {
      data,
      meta: paginator.getMeta(),
    }
  }
}
