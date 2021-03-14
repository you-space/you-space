<template>
  <q-page 
    class="home-page row items-start content-start justify-start q-py-lg"
  >
    <trending-slide />
    <video-public />
  </q-page>
</template>

<script lang='ts' >
import {
    defineComponent,
    defineAsyncComponent 
} from 'vue';

export default defineComponent({
    components:{
        VideoPublic: defineAsyncComponent(() => import('./HomeVideoPublic.vue')),
        TrendingSlide: defineAsyncComponent(() => import('./HomeTrendingSlide.vue')),
    },
    setup(){
        return {
        };
    }
});
</script>

<style lang='scss' >
.home-page {
  padding-right: $flex-gutter-xl;
  padding-left: $flex-gutter-xl;
}
@media (max-width: $breakpoint-xs-max) {
  .home-page {
    padding-right: $flex-gutter-sm;
    padding-left: $flex-gutter-sm;

  }
}

</style>