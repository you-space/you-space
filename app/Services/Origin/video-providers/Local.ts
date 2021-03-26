import { OriginVideoProvider } from 'App/Services/Origin/types'
import lodash from 'lodash'
import { OriginHelper } from 'App/Services/Origin/helpers'
import { OriginConfig } from 'App/Models/Origin'
import Env from '@ioc:Adonis/Core/Env'

export default class LocalProvider extends OriginHelper implements OriginVideoProvider {
  public async getTotalVideos() {
    return 0
  }

  public async getVideoComments() {
    return []
  }

  public async getVideos() {
    return []
  }

  public serializeVideo(data) {
    const baseURL = '/api/v1'
    return {
      videoId: lodash.get(data, 'id', null),
      name: lodash.get(data, 'name', null),
      src: `${baseURL}/files/embed/${lodash.get(data, 'id', null)}`,
      description: lodash.get(data, 'description', null),
      thumbnailSrc: data.thumbnail ? `${baseURL}/files/embed/${data.thumbnail.id}` : undefined,
      viewsCount: 0,
    }
  }

  public serializeComment(data) {
    return {
      commentId: lodash.get(data, `id`, null),
      parentCommentId: undefined,
      userId: lodash.get(data, `snippet.authorChannelId.value`, null),
      username: lodash.get(data, `snippet.authorDisplayName`, null),
      avatarSrc: lodash.get(data, `snippet.authorProfileImageUrl`, null),
      content: lodash.get(data, `snippet.textDisplay`, null),
      likeCount: lodash.get(data, `snippet.likeCount`, 0),
      unlikeCount: lodash.get(data, `snippet.unlikeCount`, 0),
    }
  }
}
