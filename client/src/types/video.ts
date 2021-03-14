export interface Video {
    id: number;
    videoId: number;
    name: string;
    type: undefined | 'you-tube',
    src: string
    thumbnailSrc?: string
    originId?: number
    origin: {
      name: string
    }
  }
  