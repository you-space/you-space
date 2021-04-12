<template>
  <q-page padding class="row">
    <div class="col-8 q-px-md relative-position">
      <q-inner-loading :showing="!video">
        <q-spinner-gears size="50px" color="primary" />
      </q-inner-loading>

      <template v-if="video">
        <q-video :src="video.src" style="height: 500px; max-width: 1100px" />
        <h2 class="text-h5 text-bold">{{ video.title }}</h2>
        <p style="white-space: pre-line">
          {{ video.description }}
        </p>
      </template>
    </div>

    <div class="col-4 q-px-md relative-position border-r border-grey-5">
      <q-inner-loading :showing="!video">
        <q-spinner-gears size="50px" color="primary" />
      </q-inner-loading>

      <q-list v-if="video">
        <q-item-label header class="q-pt-none q-px-none">
          <h3 style="line-height: 1" class="text-h6 q-my-none q-px-none text-bold">
            {{ $t('related') }}
          </h3>
        </q-item-label>

        <q-item v-for="sVideo in sidebarVideos" :key="sVideo.id" class="items-start q-px-none">
          <q-item-section>
            <router-link :to="$common.getVideoTo(sVideo.id)">
              <r-img-or-icon
                :src="sVideo.thumbnailSrc"
                height="120px"
                width="100%"
                max-width="240px"
              />
            </router-link>
          </q-item-section>

          <q-item-section>
            <q-item-label class="flex text-grey-8">
              <router-link :to="$common.getVideoTo(sVideo.id)" active-class="text-primary">
                <h3 class="text-body2 q-my-none text-bold">
                  {{ sVideo.title }}
                </h3>
              </router-link>

              <h5 class="text-caption q-my-none">
                {{ $t('viewsLength', [video.totalViews]) }}
                <span class="q-my-md">-</span>
                {{ $d(video.publishedAt) }}
              </h5>
            </q-item-label>
          </q-item-section>
        </q-item>
      </q-list>
    </div>
  </q-page>
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
    const sidebarVideos = ref<Video[]>([])

    async function setVideo() {
      video.value = null
      const request = await machine.findVideo(props.videoId)
      setTimeout(() => {
        video.value = request
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
    }
  },
})
</script>
