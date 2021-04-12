import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import Video from 'App/Models/Video'
import OriginProvider from 'App/Services/Origin/OriginProvider'

export default class CommentsController {
  public async index({ params, request }: HttpContextContract) {
    const page = request.input('page', 1)
    const limit = 20
    const offset = (Number(page) - 1) * limit

    const video = await Video.query().preload('origin').where('id', params.video_id).firstOrFail()

    await OriginProvider.registerVideoComments(video.origin, video.videoId, page)

    const comments = await video
      .related('comments')
      .query()
      .preload('user')
      .preload('replies')
      .whereNull('parentCommentId')
      .limit(limit)
      .offset(offset)

    return comments.map((c) => OriginProvider.serializeComment(video.origin, c))
  }
}
