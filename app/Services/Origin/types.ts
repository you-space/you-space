import { OriginConfig } from 'App/Models/Origin'

export interface OriginPagination {
  totalVideos: number
}

export interface OriginVideo {
  videoId: string
  data: any
}
export interface OriginComment {
  commentId: string
  userId: string
  data: any
  replies: OriginComment[]
}

export interface CommentSerialized {
  commentId: string
  userId: string
  username: string
  avatarSrc: string
  content: string
  likeCount: number
  unlikeCount: number
}

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

export interface OriginVideoProvider {
  setup?(): void
  preload?(config: OriginConfig): Promise<void>
  getTotalVideos(): Promise<number>

  getTotalPages(): Promise<number>

  getVideos(page: number): Promise<OriginVideo[]>
  serializeVideo(data: any): VideoSerialized

  getVideoComments(videoId: string, page: number): Promise<OriginComment[]>
  serializeComment(data: any): CommentSerialized
}

export interface OriginProvider {
  fetchVideos(page: number): Promise<OriginVideo[]>
  serializeVideo(data: any): VideoSerialized
}

export interface MountedOriginProvider extends OriginProvider {
  metadata: OriginProviderMetadata
  config: OriginConfig
}

export interface OriginProviderMetadata<T = any> {
  get: () => Promise<T>
  set: (value: T) => Promise<void>
}
