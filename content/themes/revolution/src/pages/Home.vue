<template>
  <q-page padding>
    <q-infinite-scroll
      class="full-width"
      @load="onLoadInfiniteScrool"
      :disable="disableInfiniteScroll"
      :offset="250"
    >
      <div class="row full-width">
        <template v-for="video in videos" :key="video.id">
          <div class="col-3 q-pa-sm">
            <router-link :to="$common.getVideoTo(video.id)">
              <r-img-or-icon :src="video.thumbnailSrc" height="200px" width="100%" />
            </router-link>

            <router-link :to="$common.getVideoTo(video.id)">
              <h2 class="text-body1 q-mt-none text-bold text-grey-8 q-pt-md">
                {{ video.title }}
              </h2>
            </router-link>
            <div class="flex">
              <h3 class="text-caption q-my-none">
                {{ $t('viewsLength', [video.totalViews]) }}
              </h3>
              <span class="q-mx-sm">-</span>
              <h3 class="text-caption q-my-none">
                {{ $d(video.publishedAt) }}
              </h3>
            </div>
          </div>
        </template>
      </div>

      <template #loading>
        <div class="row justify-center q-my-md">
          <q-spinner-dots color="primary" size="40px" />
        </div>
      </template>
    </q-infinite-scroll>
  </q-page>
</template>

<script lang="ts">
import { defineComponent, ref } from 'vue'
import { useMachine, Video } from '@/plugins/you-space'

export default defineComponent({
  name: 'Home',
  setup() {
    const machine = useMachine()
    const videos = ref<Video[]>([])
    const page = ref(1)
    const lastPage = ref(10)
    const disableInfiniteScroll = ref(false)

    async function addVideosPage() {
      if (page.value === lastPage.value) {
        disableInfiniteScroll.value = true
        return
      }

      const { data, meta } = await machine.fetchVideos({
        page: page.value,
      })

      videos.value = videos.value.concat(data)

      lastPage.value = meta.last_page

      page.value++
    }

    async function onLoadInfiniteScrool(index: number, done: () => void) {
      await addVideosPage()

      setTimeout(() => {
        done()
      }, 2000)
    }

    return {
      videos,
      disableInfiniteScroll,
      onLoadInfiniteScrool,
    }
  },
})
</script>
