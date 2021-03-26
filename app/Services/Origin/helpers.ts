import Video from 'App/Models/Video'
import Origin from 'App/Models/Origin'
import Redis from '@ioc:Adonis/Addons/Redis'
export class OriginHelper {
  public metadataKey: string

  constructor(public origin: Origin, public redisKey: string) {
    this.metadataKey = `${redisKey}:metadata`
  }

  public async getMetadata() {
    const jsonString = await Redis.get(this.metadataKey)
    return jsonString ? JSON.parse(jsonString) : {}
  }

  public async saveMetadata(metadata: object) {
    await Redis.set(this.metadataKey, JSON.stringify(metadata))
  }
}
