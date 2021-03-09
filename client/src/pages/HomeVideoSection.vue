<template>
  <q-card
    flat
    class="full-width home-video-card"
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
            v-if="video.thumbSrc"
            :src="video.thumbSrc"
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
              {{ $t('viewsCount', [video.visualizations_count]) }}
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
                    videoId: video.videoId
                }
            });
        };

        return {
            openVideo 
        };
    }
});
</script>
<style lang="scss">
.home-video-card {
  .video-title {
    text-overflow: ellipsis;
    white-space: nowrap;
    overflow: hidden;
    max-width: 100%;
  }
}

.card-preview {
  min-height: 230px;
  max-height: 230px;
  color: rgba($dark, .7);
  cursor: pointer;

  .card-preview-thumb, .q-img {
    background-color: rgba($dark, .1);
    height: 70%;
  }
}
</style>