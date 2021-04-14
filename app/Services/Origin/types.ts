import { OriginConfig } from 'App/Models/Origin'

/**
 * Video format to be inserted in database
 * videoId is the id of origin source
 * data is a object raw of the video to be used later in serialization
 */
export interface OriginVideo {
  videoId: string
  data: any
}

/**
 * Video format to be showed in front-end
 * This is a more readable object of the video that was serialized by an origin provider
 */
export interface VideoSerialized {
  videoId: string
  title: string
  src: string
  originLink: string
  description: string
  thumbnailSrc?: string
  viewsCount: number
  publishedAt: string
}

/**
 * Comment format to be inserted in database
 * userId and commendId are the ids of origin source
 * data is a object raw of the comment to be used later in serialization
 */
export interface OriginComment {
  commentId: string
  userId: string
  data: any
  replies: OriginComment[]
}

/**
 * Comment format to be showed in front-end
 * This is a more readable object of the comment that was serialized by an origin provider
 */
export interface CommentSerialized {
  commentId: string
  userId: string
  username: string
  avatarSrc: string
  content: string
  likeCount: number
  unlikeCount: number
}

/**
 * The OriginProvider is what will make the third-party request to get videos and comments of others api
 */
export interface OriginProvider {
  /**
   * Get videos of respective page
   * @param page
   */
  fetchVideos(page: number): Promise<OriginVideo[]>
  /**
   * Convert video raw data to a serialized video
   * @param data
   */
  serializeVideo(data: any): VideoSerialized
  /**
   * Get video comments of respective page
   * @param videoId
   * @param page
   */
  fetchComments(videoId: string, page: number): Promise<OriginComment[]>
  /**
   * Convert comment raw data to serialized comment
   * @param data
   */
  serializeComment(data: any): CommentSerialized
}

/**
 * The MountedOriginProvider is a OriginProvider instantiated by the OriginService
 */
export interface MountedOriginProvider extends OriginProvider {
  metadata: OriginProviderMetadata
  config: OriginConfig
}

/**
 * This is a helper to use in OriginProviders
 * it used to save some needed data like pageTokens in Youtube api
 */
export interface OriginProviderMetadata<T = any> {
  get: () => Promise<T>
  set: (value: T) => Promise<void>
}
