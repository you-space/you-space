<template>
  <div class="full-width q-mb-sm">
    <div class="text-h6">
      {{ $t('trending') }}
    </div>
  </div>
  <q-carousel
    v-model="slide"
    animated
    navigation
    infinite
    :autoplay="autoplay"
    arrows
    transition-prev="slide-right"
    transition-next="slide-left"
    class="q-mx-auto"
    style="width:100%;max-width:1000px"
    @mouseenter="autoplay = false"
    @mouseleave="autoplay = true"
  >
    <q-carousel-slide
      v-for="(video, index) in videos"
      :key="index"
      :name="index + 1"
      @click="openVideo(video)"
    >
      <q-img
        fit="cover"
        height="100%"
        radio="16/9"
        :src="video.thumbnailSrc"
      />
    </q-carousel-slide>
  </q-carousel>
</template>

<script lang='ts'>
import { ref, defineComponent, onMounted } from 'vue';
import lodash from 'lodash';

import { Video } from 'src/types/video';
import { openVideo } from 'src/functionts';
import { api } from 'boot/axios';

export default defineComponent({
    setup () {
        const videos = ref<Video[]>([]);
        
        async function setTrendingVideos () {
            const request = await api.get<Video[]>('videos/trending');
            videos.value = lodash.get(request, 'data.data', []);

        }

        async function load () {
            await setTrendingVideos();
        }
        
        onMounted(load);
        return {
            videos,
            slide: ref(1),
            autoplay: ref(true),
            openVideo
        };
    }
});

</script>

<style>

</style>