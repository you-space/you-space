import BaseOriginProvider from 'App/Services/Origin/BaseOriginProvider'
export default class LocalProvider extends BaseOriginProvider {
  public async getTotalVideos() {
    const { count } = await this.origin.related('videos').query().count('*').firstOrFail()
    return count
  }
}
