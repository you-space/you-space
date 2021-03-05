<template>
  <q-page class="row items-start content-start justify-start q-pa-lg">
    <div
      class="col-6"
      style="height:500px"
    >
      <y-video :src="videoSrc" />
    </div>
  </q-page>
</template>

<script lang='ts' >
import { defineComponent } from 'vue';
import { useRoute } from 'vue-router';

export default defineComponent({
    setup(){
        const route = useRoute();
        const { videoId } = route.params;
        const videoSrc = `${process.env.API_URL as string}/videos/${videoId as string}`;
        
        return {
            videoSrc
        };
    }
});
</script>