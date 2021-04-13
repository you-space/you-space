<template>
  <r-page class="flex" padding>
    <div class="w-8/12 px-4">
      <r-inner-loading v-model="loading" />

      <template v-if="!loading">
        <r-video :src="video.src" width="w-full" style="height: 500px; max-width: 1100px" />
        <h2 class="text-xl font-bold mt-4 mb-2">{{ video.title }}</h2>
        <p style="white-space: pre-line">
          {{ video.description }}
        </p>
        <r-list class="my-4">
          <r-comment
            v-for="comment in comments"
            :key="comment.id"
            :comment="comment"
            :replies="comment.replies"
          >
          </r-comment>
        </r-list>
      </template>
    </div>

    <div class="w-4/12 px-2 border-l border-gray-300">
      <r-inner-loading v-model="loading" />

      <r-list v-if="!loading">
        <r-item class="pt-0">
          <h3 class="text-2xl my-0 font-bold leading-none">
            {{ $t('related') }}
          </h3>
        </r-item>

        <r-item v-for="sVideo in sidebarVideos" :key="sVideo.id">
          <r-item-section>
            <router-link :to="$common.getVideoTo(sVideo.id)">
              <r-img :src="sVideo.thumbnailSrc" height="h-32" width="w-full" max-width="240px" />
            </router-link>
          </r-item-section>

          <r-item-section class="px-2">
            <router-link :to="$common.getVideoTo(sVideo.id)" active-class="text-primary">
              <h3 class="text-base font-bold">
                {{ sVideo.title }}
              </h3>
            </router-link>

            <h5 class="text-sm">
              {{ $t('viewsLength', [video.totalViews]) }}
              <span class="my-2">-</span>
              {{ $d(video.publishedAt) }}
            </h5>
          </r-item-section>
        </r-item>
      </r-list>
    </div>
  </r-page>
</template>
<script lang="ts">
import { defineComponent, ref, watch } from 'vue'
import { useMachine, Video } from '@/plugins/you-space'

export default defineComponent({
  props: {
    videoId: {
      type: String,
      required: true,
    },
  },
  setup(props) {
    const machine = useMachine()
    const video = ref<Video | null>(null)
    const comments = ref([])
    const sidebarVideos = ref<Video[]>([])
    const loading = ref(false)

    async function setVideo() {
      loading.value = true
      video.value = await machine.findVideo(props.videoId)
      comments.value = await machine.fetchVideoComments(props.videoId)
      setTimeout(async () => {
        loading.value = false
      }, 800)
    }

    async function setSidebarVideos() {
      const { data } = await machine.fetchVideos()
      sidebarVideos.value = data
    }

    void setSidebarVideos()

    watch(() => props.videoId, setVideo, {
      immediate: true,
    })

    return {
      video,
      sidebarVideos,
      comments,
      loading,
    }
  },
})
</script>
