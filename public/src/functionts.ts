import lodash from 'lodash';

import { ref, Ref } from 'vue';
import { api, axios } from 'boot/axios';

import { Video } from './types/video';
import { router } from 'src/router';

interface VideoRequestParams {
    page?: number
}

interface VideoResponse {
    meta: {
        totalVideo: number
        pages: number
    },
    data: Video
}

export function openVideo (video: Video) {
    return router.push({
        name: 'video',
        params: {
            videoId: video.id
        }
    });
}

export function getVideoPath (video: Video) {
    return {
        name: 'video',
        params: {
            videoId: video.id
        }
    };
}

export function setVideoSrc (videoRef: Ref<string>, video: Video) {
    if (video.origin.type !== 'main') {
        videoRef.value = video.src;
        return;
    }

    void api.get(`/videos/embed/${video.videoId}`, {
        responseType: 'blob'
    })
        .then((response) => {
            videoRef.value = URL.createObjectURL(response.data);
        });
}

export async function getImgSrc (video: Video) {
    if (video.origin.type !== 'main') {
        return video.thumbnailSrc;
    }
    
    if (!video.thumbnailSrc) {
        return undefined;
    }

    const token = localStorage.getItem('token');

    const request = await axios.get(video.thumbnailSrc, {
        responseType: 'blob',
        headers: {
            'Authorization': `Bearer ${String(token)}`
        }
    });

    return URL.createObjectURL(request.data);
}

export function usePublicVideosInfiniteScroll(){
    const videos = ref<Video[]>([]);
    const pages = ref<number | null>(null);
    const disable = ref(false);

    async function getVideos (params?: VideoRequestParams) {
        const request = await api.get<VideoResponse>('videos', {
            params
        });

        pages.value = request.data.meta.pages;
        
        const videos: Video[] = lodash.get(request, 'data.data', []);

        return await Promise.all(videos.map(async v => ({
            ...v,
            thumbnailSrc: await getImgSrc(v)
        })));
    }

    async function addNextPage (index: number, callback: () => void) {     
        
        const nextPage = await getVideos({
            page: index
        });
        
        if (nextPage.length === 0) {
            disable.value = true;
            callback();
            return;
        }
        
        setTimeout(() => {
            videos.value = videos.value.concat(nextPage);
            callback();
        }, 800);
    }

    return {
        videos,
        addNextPage,
        disable
    };
}