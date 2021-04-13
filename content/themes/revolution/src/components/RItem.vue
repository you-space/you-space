<template>
  <li class="flex p-2">
    <router-link v-if="to" :to="to">
      <slot />
    </router-link>

    <slot v-else />
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
