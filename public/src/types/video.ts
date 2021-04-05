import { Origin } from './origin';
export interface Video {
    id: number;
    videoId: number;
    name: string;
    type: undefined | 'you-tube';
    src: string;
    thumbnailSrc?: string;
    originId?: number;
    viewsCount: number;
    visibility: {
        name: string;
    };
    origin: Origin;
}
