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
  description: string
  thumbnailSrc?: string
  viewsCount: number
}

export interface OriginVideoProvider {
  preload?(config: OriginConfig): Promise<void>
  getTotalVideos(): Promise<number>
  getVideos(page: number): Promise<OriginVideo[]>
  serializeVideo(data: any): VideoSerialized

  getVideoComments(videoId: string, page: number): Promise<OriginComment[]>
  serializeComment(data: any): CommentSerialized
}
