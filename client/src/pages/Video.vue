<template>
  <q-page class="row items-center justify-center q-pa-lg">
    <div
      class="col-6"
      style="height:500px"
    >
      <y-video :src="videoSrc" />
    </div>
  </q-page>
</template>

<script lang='ts' >
import { api } from 'src/boot/axios';
import { Video } from 'src/types/video';
import { defineComponent, onMounted, ref } from 'vue';
import { useRoute } from 'vue-router';

export default defineComponent({
    name: 'Video',
    setup(){
        const route = useRoute();
        const { videoId } = route.params;
        const videoSrc = ref<string>('');
        
        const setVideoSrc = async () => {
            const { data } = await api.get<Video>(`/admin/videos/${String(videoId)}`);
            videoSrc.value = data.src;
        };
        
        onMounted(setVideoSrc);

        return {
            videoSrc 
        };
    }
});
</script>