<template>
  <router-link
    class="flex p-2 transition-all hover:bg-gray-200"
    exact-active-class="bg-gray-300"
    v-if="to"
    :to="to"
  >
    <slot />
  </router-link>
  <li v-else class="flex p-2">
    <slot />
  </li>
</template>
<script lang="ts">
import { defineComponent } from 'vue'

export default defineComponent({
  props: {
    to: {
      type: Object,
      default: null,
    },
  },
})
</script>
