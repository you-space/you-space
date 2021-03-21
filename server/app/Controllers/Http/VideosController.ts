import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import Video from 'App/Models/Video'
import VisibilityProvider from '@ioc:Providers/Visibility'
import Visibility, { DefaultVisibilities } from 'App/Models/Visibility'
import OriginProvider from 'App/Services/Origin/OriginProvider'

export default class VideosController {
  public async index({ request }: HttpContextContract) {
    const page = request.input('page', 1)
    const limit = 20
    const offset = (page - 1) * limit
    const { videos } = await Visibility.query()
      .preload('videos', (builder) => {
        builder
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
      })
      .where('name', DefaultVisibilities.public)
      .firstOrFail()

    const videosWithViews = videos.map((v) => ({
      ...OriginProvider.serializeVideo(v.origin, v),
      totalViews: Number(v.$extras.totalViews) || 0,
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

    const { videos } = await Visibility.query()
      .preload('videos', (builder) => {
        builder
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
      })
      .where('name', DefaultVisibilities.public)
      .firstOrFail()

    const videosWithViews = videos.map((v) => ({
      ...OriginProvider.serializeVideo(v.origin, v),
      totalViews: Number(v.$extras.totalViews) || 0,
    }))

    return {
      data: videosWithViews,
      meta: {},
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

    return {
      ...OriginProvider.serializeVideo(video.origin, video),
      viewsCount: Number(video.$extras.viewsCount) || 0,
    }
  }
}
