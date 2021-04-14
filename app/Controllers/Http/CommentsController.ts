import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import ContentService from '@ioc:Providers/ContentService'
import OriginService from '@ioc:Providers/OriginService'
import Comment from 'App/Models/Comment'
import Origin from 'App/Models/Origin'

export default class CommentsController {
  public async index({ params, request, auth }: HttpContextContract) {
    const page = request.input('page', 1)
    const limit = 20
    const offset = (Number(page) - 1) * limit

    const video = await ContentService.show(params.video_id, auth.user)

    const origin = await Origin.findOrFail(video.originId)

    await OriginService.importComments(origin, video.videoId, Number(page))

    const comments = await Comment.query()
      .where('video_id', video.id)
      .preload('user')
      .preload('replies')
      .whereNull('parentCommentId')
      .limit(limit)
      .offset(offset)

    return comments.map((c) => OriginService.serializeComment(origin, c))
  }
}
