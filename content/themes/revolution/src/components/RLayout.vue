<template>
  <div class="h-screen">
    <div class="header-content">
      <slot name="header" />
    </div>

    <div class="flex w-full h-full items-stretch">
      <div class="r-layout-drawer">
        <slot name="drawer" />
      </div>
      <div class="r-layout-content flex-grow w-auto">
        <slot />
      </div>
    </div>
  </div>
</template>
<script lang="ts">
import { defineComponent } from 'vue'

export default defineComponent({
  setup() {
    return {}
  },
})
</script>
