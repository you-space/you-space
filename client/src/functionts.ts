import { Video } from './types/video';
import { router } from 'src/router';

export function openVideo (video: Video) {
    return router.push({
        name: 'video',
        params: {
            videoId: video.id
        }
    });
}
