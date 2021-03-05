import { Video } from "src/types/video";

export function getVideoThumbnailPath (video: Video) {
    return `${process.env.API_URL as string}/thumbnails/${String(video.id)}`;
}