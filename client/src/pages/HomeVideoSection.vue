<template>
  <q-card flat>
    <div class="text-h6">
      {{ title.toUpperCase() }}
    </div>
    <q-separator class="q-my-sm" />

    <q-card-section>
      <div class="row q-gutter-md">
        <q-card
          v-for="video in videos"
          :key="video.id"
          class="col-2"
          style="height:200px"
          dark
          bordered
        >
          <y-video :video-id="video.id" />
        </q-card>
      </div>
    </q-card-section>
  </q-card>
</template>

<script>
import { defineComponent } from 'vue';


export default defineComponent({
    props: {
        title: {
            type: String,
            required: true,
            default: null
        },
        videos: {
            type: Array,
            required: true,
            default: () => []
        }
    },
    // setup(){
    //     console.log('teste');
    //     return {};
    // }
});
</script>