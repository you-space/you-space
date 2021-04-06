import lodash from 'lodash'
import { OriginVideoProvider } from 'App/Services/Origin/types'
import { OriginHelper } from 'App/Services/Origin/helpers'
import OriginMain from '@ioc:Providers/OriginMainProvider'

export default class LocalProvider extends OriginHelper implements OriginVideoProvider {
  public async getTotalVideos() {
    const { count } = await OriginMain.related('videos').query().count('*').firstOrFail()
    return count
  }

  public async getVideoComments() {
    return []
  }

  public async getVideos() {
    return []
  }

  public serializeVideo() {
    return {
      videoId: '',
      title: '',
      src: '',
      description: '',
      thumbnailSrc: undefined,
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
