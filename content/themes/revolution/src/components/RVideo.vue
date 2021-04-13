<template>
  <iframe :src="src" :class="[width, height]" frameborder="0"></iframe>
</template>
<script lang="ts">
import { defineComponent } from 'vue'

export default defineComponent({
  props: {
    src: {
      type: String,
      required: true,
    },
    height: {
      type: String,
      default: 'h-64',
    },
    width: {
      type: String,
      required: true,
      default: 'w-64',
    },
  },
})
</script>
