<template>
  <div class="full-width full-height q-video">
    <video 
      v-if="videoSrc"
      class="full-width full-height"
      controls
      :src="videoSrc"
    />
  </div>
</template>

<script lang='ts' >
import { defineComponent } from 'vue';

export default defineComponent({
    name: 'Video',
    props: {
        videoId: {
            type: Number,
            required: true
        }
    },
    setup(props){
        const videoSrc = `${process.env.API_URL as string}/videos/${props.videoId}`;

        return {
            videoSrc 
        };
    }
});
</script>