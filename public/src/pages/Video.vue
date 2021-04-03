<template>
    <q-page class="row items-center justify-center q-pa-lg">
        <div
            class="col-6"
            style="height:500px"
        >
            <y-video
                v-if="video"
                :src="video.src"
            />
        </div>
    </q-page>
</template>

<script lang='ts' >
import { api } from 'src/boot/axios';
import { Video } from 'src/types/video';
import { defineComponent, ref } from 'vue';
import { useRoute } from 'vue-router';

export default defineComponent({
    name: 'Video',
    setup(){
        const route = useRoute();
        const { videoId } = route.params;
        const video = ref<Video | null>(null);
        
        const setVideo = async () => {
            const { data } = await api.get<Video>(`/videos/${String(videoId)}`);
            video.value = data;
        };
        
        void setVideo();

        return {video};
    }
});
</script>