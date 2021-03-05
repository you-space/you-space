<template>
  <q-card
    flat
    class="full-width"
  >
    <div class="text-h6">
      {{ title.toUpperCase() }}
    </div>
    <q-separator class="q-my-sm" />

    <q-card-section>
      <div class="row q-gutter-md">
        <q-card
          v-for="video in videos"
          :key="video.id"
          class="col-2 card-preview"
          @click="openVideo(video)"
        >
          <q-img
            v-if="video.hasThumbnail"
            :src="getVideoThumbnailPath(video)"
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
            <div class="text-h6">
              {{ video.name }}
            </div>
            <div
              v-if="video.visualizations"
              class="text-caption"
            >
              {{ $t('viewsCount', [video.visualizations]) }}
            </div>
          </q-card-actions>
        </q-card>
      </div>
    </q-card-section>
  </q-card>
</template>

<script lang='ts' >
import { Video } from 'src/types/video';
import { defineComponent } from 'vue';
import { useRouter } from 'vue-router';
import { getVideoThumbnailPath } from 'src/functionts';

export default defineComponent({
    props: {
        title: {
            type: String,
            required: true,
            default: null
        },
        videos: {
            type: Array,
            required: true,
            default: () => []
        }
    },
    setup(){
        const router = useRouter();

        const openVideo = (video: Video) => {
            return router.push({
                name: 'video',
                params: {
                    videoId: video.id
                }
            });
        };

        return {
            openVideo,
            getVideoThumbnailPath
        };
    }
});
</script>
<style lang="scss">
.card-preview {
  height: auto;
  min-height: 230px;
  color: rgba($dark, .7);
  cursor: pointer;

  .card-preview-thumb {
    background-color: rgba($dark, .1);
    height: 70%;
  }
}
</style>