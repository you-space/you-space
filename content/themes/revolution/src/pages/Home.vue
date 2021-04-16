<template>
  <r-page padding>
    <r-infinite-scroll :disable="disableInfiniteScroll" :offset="250">
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
import { defineComponent, ref, onMounted } from 'vue'
import { machine, Video } from '@/plugins/you-space'

const page = ref(1)
const lastPage = ref(10)

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

const videos = ref<Video[]>([])
const disableInfiniteScroll = ref(false)

export default defineComponent({
  name: 'Home',
  async serverPrefetch() {
    await addVideosPage()
  },
  setup() {
    onMounted(() => {
      if (videos.value.length === 0) {
        addVideosPage()
      }
    })

    return {
      videos,
      disableInfiniteScroll,
    }
  },
})
</script>
