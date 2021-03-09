<template>
  <q-page class="row items-center justify-center q-pa-lg">
    <q-card
      class="col full-width full-height "
      style="max-width:1000px"
    >
      <q-video
        v-if="videoSrc"
        :ratio="16/9"
        class="col full-width full-height"
        :src="videoSrc"
      />
    </q-card>
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
        const { videoId, originId } = route.params;
        const videoSrc = ref<string>('');
        
        const setVideoSrc = async () => {
            const { data } = await api.get<Video>(`/admin/videos/${String(videoId)}`, {
                params: {
                    originId: originId !== 'main' ? originId : undefined
                }
            });
            console.log(data);
            videoSrc.value = data.src;
        };
        
        onMounted(setVideoSrc);

        return {
            videoSrc 
        };
    }
});
</script>