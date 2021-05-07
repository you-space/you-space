import OriginMain from '@ioc:Providers/OriginMain'
import Entity from 'App/Models/Entity'
import EntityItem from 'App/Models/Item'
import { OriginProvider } from './types'

export default class LocalProvider implements OriginProvider {
  public async fetchVideos() {
    const entityVideo = await Entity.firstOrCreate({
      name: 'video',
    })

    const videos = await entityVideo.related('items').query().where('originId', OriginMain.id)

    return videos.map((v) => ({
      data: v.value,
      videoId: v.sourceId,
    }))
  }

  public async fetchComments(videoId: string) {
    const video = await EntityItem.findByOrFail('sourceId', videoId)

    const comments = await video.related('child').query().preload('child')

    return comments.map((comment) => {
      return {
        commentId: comment.sourceId,
        userId: comment.value.userId,
        data: comment.value,
        replies: comment.child.map((reply) => ({
          commentId: reply.sourceId,
          userId: reply.value.userId,
          data: reply.value,
          replies: [],
        })),
      }
    })
  }

  public serializeVideo(data: any) {
    return data
  }

  public serializeComment(data: any) {
    return data
  }
}
