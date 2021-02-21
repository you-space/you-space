<template>
  <q-page class="row items-center justify-center q-pa-lg">
      <q-card class="col full-width full-height " style="max-width:1000px" >
           <q-video
            :ratio="16/9"
            class="col full-width full-height" v-if="videoSrc" :src='videoSrc'
            >

           </q-video>
      </q-card>
  </q-page>
</template>

<script lang='ts' >
import { defineComponent } from 'vue'
import { useRoute } from 'vue-router'

export default defineComponent({
    name: 'Video',
    setup(){
        const route = useRoute();
        const {videoId} = route.params;
        const videoSrc = `${process.env.API_URL as string}/videos/${videoId as string}`;
        
        // setvideo() {

        // }

        return {
            videoSrc
        }
    }
})
</script>