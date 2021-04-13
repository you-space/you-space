<template>
  <div class="h-screen">
    <div class="header-content" ref="header">
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
import { computed, defineComponent, ref } from 'vue'

export default defineComponent({
  setup() {
    const header = ref<HTMLElement | null>(null)

    const height = computed(() => {
      if (header.value) {
        return `calc(100% - ${header.value.clientHeight})`
      }
      return '100%'
    })

    return {
      height,
      header,
    }
  },
})
</script>
