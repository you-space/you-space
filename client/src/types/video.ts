export interface Video {
    videoId: number;
    name: string;
    type: undefined | 'you-tube',
    src: string
    thumbSrc?: string
    originId?: number
  }
  