<template>
  <q-page class="row items-stretch q-pa-lg">
    <div class="col-8">
      <div class="row">
        <div
          class="col-12 q-mb-sm"
          style="min-height:500px"
        >
          <y-video
            v-if="video"
            :src="videoSrc"
            class="q-mb-lg"
          />
          <q-skeleton
            v-else
            style="height:100%"
            square
          />
        </div>

        <div
          class="col-12 q-mb-md"
          style="min-height:30px"
        >
          <template v-if="video">
            <h1 class="text-h4 q-my-none q-mb-sm">
              {{ video.name }}
            </h1>
            <h4 class="text-caption q-my-none">
              {{ $t('viewsCount', [video.viewsCount]) }}
            </h4>
          </template>

          <template v-else>
            <q-skeleton
              style="height:30px"
              class="full-width"
              type="text"
            />
            <q-skeleton
              style="height:30px;max-width:50%"
              class="full-width"
              type="text"
            />
          </template>
        </div>
        

        <video-comment-section
          v-if="video"
          :video-id="video.id"
          class="col-12"
        />
      </div>
    </div>
    
    <div class="col-4 q-px-md full-height">
      <video-sidebar />
    </div>
  </q-page>
</template>

<script lang='ts' >
import { api } from 'src/boot/axios';
import { setVideoSrc } from 'src/functionts';
import { Video } from 'src/types/video';
import { defineComponent, defineAsyncComponent, ref, watch } from 'vue';

export default defineComponent({
    name: 'Video',
    components: {
        VideoSidebar: defineAsyncComponent(() => import('./VideoSidebar.vue')),
        VideoCommentSection: defineAsyncComponent(() => import('./VideoCommentSection.vue'))
    },
    props: {
        videoId: {
            type: String,
            default: null
        }
    },
    setup(props){
        const video = ref<Video | null>(null);
        const videoSrc = ref('');
        
        const setVideo = async (id: string) => {
            video.value = null;
            const { data } = await api.get<Video>(`/videos/${id}`);
            video.value = data;
            void setVideoSrc(videoSrc, video.value);
        };
        
        watch(() => props.videoId, setVideo, {
            immediate: true
        });

        return {
            video,
            videoSrc
        };
    }
});
</script>