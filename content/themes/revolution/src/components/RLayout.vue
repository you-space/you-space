<template>
  <div class="h-screen">
    <div class="header-content">
      <slot name="header" />
    </div>

    <div class="flex w-full items-stretch" :style="`height: ${height}`">
      <div class="r-layout-drawer">
        <slot name="drawer" />
      </div>
      <div class="r-layout-content flex-grow h-full w-auto">
        <slot />
      </div>
    </div>
  </div>
</template>
<script lang="ts">
import { defineComponent } from 'vue'

export default defineComponent({
  setup() {
    const height = 'calc(100% - 41px)'
    return {
      height,
    }
  },
})
</script>
