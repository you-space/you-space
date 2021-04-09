import Origin, { OriginConfig } from 'App/Models/Origin'
import Redis from '@ioc:Adonis/Addons/Redis'
import {
  OriginVideoProvider,
  CommentSerialized,
  VideoSerialized,
  OriginComment,
  OriginVideo,
} from './types'
import OriginException from 'App/Exceptions/OriginException'
export default class BaseOriginProvider implements OriginVideoProvider {
  public metadataKey: string

  constructor(public origin: Origin, public redisKey: string) {
    this.metadataKey = `${redisKey}:metadata`
  }

  public static async checkConfig(_config: OriginConfig) {
    return true
  }

  public async getMetadata() {
    const jsonString = await Redis.get(this.metadataKey)
    return jsonString ? JSON.parse(jsonString) : {}
  }

  public async saveMetadata(metadata: object) {
    await Redis.set(this.metadataKey, JSON.stringify(metadata))
  }

  public async getTotalPages(): Promise<number> {
    throw new OriginException(
      'Missing implementation getTotalPages',
      this.origin.type,
      this.origin.name
    )
  }

  public async getTotalVideos(): Promise<number> {
    throw new OriginException(
      'Missing implementation getTotalVideos',
      this.origin.type,
      this.origin.name
    )
  }

  public async getVideos(_page: number): Promise<OriginVideo[]> {
    throw new OriginException(
      'Missing implementation getVideos',
      this.origin.type,
      this.origin.name
    )
  }

  public serializeVideo(_data: any): VideoSerialized {
    throw new OriginException(
      'Missing implementation serializeVideo',
      this.origin.type,
      this.origin.name
    )
  }

  public async getVideoComments(_videoId: string, _page: number): Promise<OriginComment[]> {
    throw new OriginException(
      'Missing implementation getVideoComments',
      this.origin.type,
      this.origin.name
    )
  }

  public serializeComment(_data: any): CommentSerialized {
    throw new OriginException(
      'Missing implementation serializeComment',
      this.origin.type,
      this.origin.name
    )
  }
}
