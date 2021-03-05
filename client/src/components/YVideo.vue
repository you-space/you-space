<template>
  <q-card
    dark
    class="full-width full-height q-video"
  >
    <video
      class="full-width full-height ys-video"
      controls
      :src="src"
    />
  </q-card>
</template>

<script lang='ts' >
import { defineComponent } from 'vue';

export default defineComponent({
    name: 'Video',
    props: {
        src: {
            type: String,
            required: true
        }
    },
    setup(){
        return {
        };
    }
});
</script>

<style lang="scss">
.ys-video {
    object-fit: fill;
}
</style>