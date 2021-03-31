export interface Video {
    id: number;
    videoId: number;
    name: string;
    type: undefined | 'you-tube',
    src: string
    thumbnailSrc?: string
    originId?: number
    visibility: {
      name: string
    }
    origin: {
      name: string
      type: string
    }
  }
export interface Comment {
    username: string;
    content: string
    avatarSrc: string
    replies?: Comment[]
}