<template>
  <q-page class="row items-start content-start justify-start q-pa-lg">
    <video-section
      v-for="(section, index) in sections"
      :key="index"
      class="q-mb-lg"
      :title="section.title"
      :videos="section.videos"
    />
  </q-page>
</template>

<script lang='ts' >
import {
    defineComponent,
    ref,
    onMounted,
    defineAsyncComponent 
} from 'vue';
import { api } from 'boot/axios';
import { Video } from 'src/types/video';
import { useI18n } from 'vue-i18n';

interface Section  {
  title: string
  videos: Video[]
}

export default defineComponent({
    components:{
        VideoSection: defineAsyncComponent(() => import('./HomeVideoSection.vue'))
    },
    setup(){
        const tm = useI18n();
        const sections = ref<Section[]>([]);

        async function setNewVideos () {
            const { data } = await api.get<Video[]>('videos/recommendations');
            sections.value.push({
                title: tm.t('new-updates'),
                videos: data
            });
        }

        async function setRecomendedVideos () {
            const { data } = await api.get<Video[]>('videos/recommendations');
            sections.value.push({
                title: tm.t('recomended'),
                videos: data
            });
        }
        
        async function setTrendingVideos () {
            const { data } = await api.get<Video[]>('videos/trending');
            sections.value.push({
                title: tm.t('trending'),
                videos: data
            });
        }

        async function load () {
            await setTrendingVideos();
            await setNewVideos();
            await setRecomendedVideos();
        }
        
        onMounted(load);

        return {
            sections
        };
    }
});
</script>

<style>

</style>