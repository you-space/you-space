import { Origin } from './origin';
export interface Video {
    id: number;
    videoId: number;
    title: string;
    description: string;
    type: string;
    src: string;
    thumbnailSrc?: string;
    originId?: number;
    viewsCount: number;
    visibilityId: number;
    visibilityName: string;
    origin: Origin;
}
