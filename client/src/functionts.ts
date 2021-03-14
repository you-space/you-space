import lodash from 'lodash';

import { ref } from 'vue';
import { api } from 'boot/axios';

import { Video } from './types/video';
import { router } from 'src/router';

interface VideoRequestParams {
    page?: number
}

export function openVideo (video: Video) {
    return router.push({
        name: 'video',
        params: {
            videoId: video.id
        }
    });
}

export function usePublicVideosInfiniteScroll(){
    const videos = ref<Video[]>([]);

    async function getVideos (params?: VideoRequestParams) {
        const request = await api.get<Video[]>('videos', {
            params
        });
        
        return lodash.get(request, 'data.data', []);
    }

    async function addNextPage (index: number, callback: () => void) {
        const nextPage = await getVideos({
            page: index
        });

        
        setTimeout(() => {
            videos.value = videos.value.concat(nextPage);
            callback();
        }, 800);
    }

    return {
        videos,
        addNextPage
    };
}