import { Video } from "src/types/video";

export function getVideoThumbnailPath (video: Video) {
    if (video.type === 'you-tube') {
        return video.thumbSrc;
    }
    return `${process.env.API_URL as string}/thumbnails/${String(video.videoId)}`;
}