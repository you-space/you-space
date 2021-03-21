import { OriginConfig } from 'App/Models/Origin'

export interface OriginPagination {
  totalVideos: number
}

export interface OriginVideo {
  videoId: string
  data: any
}

export interface VideoSerialized {
  videoId: string
  name: string
  src: string
  description: string
  thumbnailSrc: string
  viewsCount: number
}

export interface OriginVideoProvider {
  preload?(config: OriginConfig): Promise<void>
  getTotalVideos(): Promise<number>
  getVideos(page: number): Promise<OriginVideo[]>
  serializeVideo(data: any): VideoSerialized
  //   serializeComment(data: any): Comment
}
