import { api } from 'boot/axios';

import { Video } from './types/video';
import { router } from 'src/router';
import { Visibility } from './types';
import { Origin } from 'src/pages/Origins/composition';

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

export async function getBase64(file: File): Promise<string> {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = () => resolve(reader.result as string);
        reader.onerror = (error) => reject(error);
    });
}
