import lodash from 'lodash';

import { ref, Ref } from 'vue';
import { api, axios } from 'boot/axios';

import { Video } from './types/video';
import { router } from 'src/router';
import { Origin, Visibility } from './types';

export function openVideo(video: Video) {
    return router.push({
        name: 'video',
        params: { videoId: video.id },
    });
}

export function getVideoPath(video: Video) {
    return {
        name: 'video',
        params: { videoId: video.id },
    };
}

export async function getVisibilities() {
    const { data } = await api.get<Visibility[]>('admin/visibilities');
    return data;
}

export async function getOrigins() {
    const { data } = await api.get<Origin[]>('admin/origins');
    return data;
}
