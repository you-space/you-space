<template>
  <div class="r-infinite-scroll">
    <slot />
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue'

export default defineComponent({
  emits: ['load'],
  setup(_, { emit }) {
    emit('load')
    return {}
  },
})
</script>
