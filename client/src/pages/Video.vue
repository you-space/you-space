<template>
  <q-page class="row items-stretch q-pa-lg">
    <div
      class="col-8"
      style="height:500px"
    >
      <template v-if="video">
        <y-video
          :src="video.src"
          class="q-mb-lg"
        />
        <h1 class="text-h4">
          {{ video.name }}
        </h1>
      </template>
    </div>
    <div class="col-4 q-px-md full-height">
      <video-sidebar />
    </div>
  </q-page>
</template>

<script lang='ts' >
import { api } from 'src/boot/axios';
import { Video } from 'src/types/video';
import { defineComponent, defineAsyncComponent, ref, watch } from 'vue';

export default defineComponent({
    name: 'Video',
    components: {
        VideoSidebar: defineAsyncComponent(() => import('./VideoSidebar.vue'))
    },
    props: {
        videoId: {
            type: String,
            default: null
        }
    },
    setup(props){
        const video = ref<Video | null>(null);
        
        const setVideo = async (id: string) => {
            video.value = null;
            const { data } = await api.get<Video>(`/videos/${id}`);
            video.value = data;
        };
        
        watch(() => props.videoId, setVideo, {
            immediate: true
        });

        return {
            video
        };
    }
});
</script>