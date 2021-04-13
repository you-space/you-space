<template>
  <r-page padding>
    <r-infinite-scroll @load="onLoadInfiniteScrool" :disable="disableInfiniteScroll" :offset="250">
      <div class="grid grid-cols-5 gap-5">
        <template v-for="video in videos" :key="video.id">
          <div>
            <router-link :to="$common.getVideoTo(video.id)">
              <r-img :src="video.thumbnailSrc" width="w-full" height="h-48" />
            </router-link>

            <router-link :to="$common.getVideoTo(video.id)">
              <h2 class="text-base my-2 font-bold text-gray-500 hover:text-blue-500">
                {{ video.title }}
              </h2>
            </router-link>
            <div class="flex">
              <h3 class="text-sm">
                {{ $t('viewsLength', [video.totalViews]) }}
                <span class="mx-1">-</span>
                {{ $d(video.publishedAt) }}
              </h3>
            </div>
          </div>
        </template>
      </div>

      <template #loading>
        <div class="row justify-center q-my-md">
          <f-icon icon="spinner" />
        </div>
      </template>
    </r-infinite-scroll>
  </r-page>
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

    async function onLoadInfiniteScrool() {
      await addVideosPage()

      setTimeout(() => {
        // done()
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
