import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import Video from 'App/Models/Video'
import YouTubeProvider from '@ioc:Providers/YouTube'

export default class CommentsController {
  public async showVideoComments({ params }: HttpContextContract) {
    const video = await Video.query().preload('origin').where('id', params.videoId).firstOrFail()

    return YouTubeProvider.getVideoComments(video.origin, video.videoId)
  }
}
