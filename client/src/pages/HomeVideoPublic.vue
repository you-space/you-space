<template>
  <div class="full-width q-mb-sm">
    <div class="text-h6">
      {{ $t('public') }}
    </div>
  </div>
  <q-infinite-scroll
    :offset="250"
    class="full-width"
    @load="addNextPage"
  >
    <div class="row ">
      <div
        v-for="video in videos"
        :key="video.id"
        class="col-12 col-sm-6 col-md-4 col-xl-2 q-pr-md q-pb-md"
      >
        <q-card
        
          class="card-preview"
          @click="openVideo(video)"
        >
          <q-img
            v-if="video.thumbnailSrc"
            :src="video.thumbnailSrc"
          />
            
          <div
            v-else
            class="card-preview-thumb flex items-center justify-center"
          >
            <q-icon
              size="5rem"
              name="insert_photo"
            />
          </div>

          <q-card-actions
            vertical
            align="left"
          >
            <div class="text-h6 video-title">
              {{ video.name }}
            </div>
            <div class="text-caption">
              {{ $t('viewsCount', [video.viewsCount]) }}
            </div>
          </q-card-actions>
        </q-card>
      </div>
    </div>
    <template #loading>
      <div class="row justify-center q-my-md">
        <q-spinner-dots
          color="primary"
          size="40px"
        />
      </div>
    </template>
  </q-infinite-scroll>
</template>

<script lang='ts' >
import { openVideo } from 'src/functionts';
import { Video } from 'src/types/video';
import { defineComponent, ref, onMounted } from 'vue';
import { api } from 'boot/axios';
import lodash from 'lodash';

export default defineComponent({
    setup(){
        const videos = ref<Video[]>([]);

        async function setVideos () {
            const request = await api.get<Video[]>('videos');
            videos.value = lodash.get(request, 'data.data', []);
        }
        
        async function addNextPage (index: number, done: () => void) {
            const request = await api.get<Video[]>('videos', {
                params: {
                    page: index
                }
            });
            const nextPage = lodash.get(request, 'data.data', []);
            videos.value = videos.value.concat(nextPage);
            done();
        }

        onMounted(setVideos);

        return {
            videos,
            openVideo,
            addNextPage
        };
    }
});
</script>
<style lang="scss">
.card-preview {
  height: 220px;
  color: rgba($dark, .7);
  cursor: pointer;
   .video-title {
    text-overflow: ellipsis;
    white-space: nowrap;
    overflow: hidden;
    max-width: 100%;
  }

  .card-preview-thumb, .q-img {
    background-color: rgba($dark, .1);
    height: 60%;
  }
}
</style>