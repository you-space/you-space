<template>
  <q-card
    bordered
    flat
    class="full-height q-pa-sm video-sidebar"
  >
    <div class="full-width q-mb-sm">
      <div class="text-h6">
        {{ $t('Recommended') }}
      </div>
    </div>
    <q-infinite-scroll
      :offset="250"
      class="full-width"
      :disable="disable"
      @load="addNextPage"
    >
      <div class="row">
        <div
          v-for="video in videos"
          :key="video.id"
          class="col-12 q-mb-md"
        >
          <q-card
            class="row video-card"
            bordered
            flat
          >
            <router-link
              class="col-5"
              :to="getVideoPath(video)"
            >
              <q-img
                v-if="video.thumbnailSrc"
                :src="video.thumbnailSrc"
                fit="cover"
              />
            
              <div
                v-else
                class="flex items-center justify-center"
              >
                <q-icon
                  size="5rem"
                  name="insert_photo"
                />
              </div>
            </router-link>

            <div class="col-7 q-px-md q-py-sm">
              <router-link
                class="text-subtitle2 card-title"
                :to="getVideoPath(video)"
              >
                {{ video.name }}
              </router-link>
              <div class="text-caption">
                {{ $t('viewsCount', [video.viewsCount]) }}
              </div>
            </div>
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
  </q-card>
</template>

<script lang='ts' >
import { openVideo, getVideoPath, usePublicVideosInfiniteScroll } from 'src/functionts';
import { defineComponent } from 'vue';

export default defineComponent({
    name: 'Video',
    setup(){
        const { videos, addNextPage, disable } = usePublicVideosInfiniteScroll();

        return {
            videos,
            addNextPage,
            openVideo,
            disable,
            getVideoPath
        };
    }
});
</script>

<style lang="scss" >
.video-sidebar {
  .video-card {
    --height: 110px;
    height: var(--height);
    .card-title {
      cursor: pointer;
    }
    .q-img {
      height: calc(var(--height) - 2px);
      cursor: pointer;
    }
  }
}
</style>