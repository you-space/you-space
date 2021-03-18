import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import Origin, { OriginTypes } from 'App/Models/Origin'
import Video from 'App/Models/Video'
import YouTubeProvider from '@ioc:Providers/YouTube'
import VisibilityProvider from '@ioc:Providers/Visibility'
import { DefaultVisibilities } from 'App/Models/Visibility'

export default class VideosController {
  public async index({ request }: HttpContextContract) {
    const page = request.input('page', 1)
    const limit = 20
    const offset = (page - 1) * limit
    const origins = await Origin.query().where('type', OriginTypes.YouTube)

    await Promise.all(
      origins.map(async (o) => {
        await YouTubeProvider.registerOriginVideosByPage(o, Number(page))
      })
    )

    const videos = await Video.query()
      .preload('origin')
      .whereHas('visibility', (query) => {
        query.where('name', DefaultVisibilities.public)
      })
      .offset(offset)
      .limit(limit)
      .withCount('views', (query) => {
        query.sum('count').as('viewsCount')
      })
      .orderBy('created_at', 'desc')

    const videosWithViews = videos.map((v) => ({
      ...v.serialize(),
      viewsCount: Number(v.$extras.viewsCount) || 0,
    }))

    return {
      data: videosWithViews,
      meta: {},
    }
  }

  public async trending({ request }: HttpContextContract) {
    const page = request.input('page', 1)
    const limit = 20
    const offset = (page - 1) * limit
    const origins = await Origin.query().where('type', OriginTypes.YouTube)
    let originsTotalItems = 0

    await Promise.all(
      origins.map(async (o) => {
        const { meta } = await YouTubeProvider.registerOriginVideosByPage(o, Number(page))
        originsTotalItems += meta.totalVideos
      })
    )

    const { count } = await Video.query()
      .count('*')
      .has('views')
      .whereNotIn(
        'origin_id',
        origins.map((o) => o.id)
      )
      .first()

    const videos = await Video.query()
      .preload('origin')
      .offset(offset)
      .limit(limit)
      .has('views')
      .withCount('views', (query) => {
        query.sum('count').as('viewsCount')
      })
      .orderBy('viewsCount', 'desc')

    const totalVideos = Number(count) + originsTotalItems

    const videosWithViews = videos.map((v) => ({
      ...v.serialize(),
      viewsCount: Number(v.$extras.viewsCount) || 0,
    }))

    return {
      data: videosWithViews,
      meta: {
        total: totalVideos,
        pages: Math.ceil(totalVideos / limit),
      },
    }
  }

  public async show({ params, auth }: HttpContextContract) {
    const video = await Video.query()
      .where('id', params.id)
      .preload('origin')
      .withCount('views', (query) => {
        query.sum('count').as('viewsCount')
      })
      .firstOrFail()

    const visibility = await video.related('visibility').query().firstOrFail()

    await VisibilityProvider.isAllowedToView(visibility, auth.user)

    return video
  }
}
