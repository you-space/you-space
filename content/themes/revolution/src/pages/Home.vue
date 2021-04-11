<template>
  <q-page class="flex items-start" padding>
    <div class="row q-gutter-sm full-width">
      <q-card class="col-2" v-for="video in videos" :key="video.id">
        <q-img :src="video.thumbnailSrc" height="200px" width="100%" />
      </q-card>
    </div>
  </q-page>
</template>

<script lang="ts">
import { defineComponent, ref } from 'vue'
import { useMachine } from '@/plugins/you-space'

export default defineComponent({
  name: 'Home',
  setup(_, root) {
    const machine = useMachine()
    const videos = ref<any[]>([])

    async function setVideos() {
      const request = await machine.fetchVideos()
      videos.value = request.data
    }

    void setVideos()

    return {
      videos,
    }
  },
})
</script>
