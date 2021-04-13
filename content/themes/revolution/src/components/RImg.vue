<template>
  <div :style="`width: ${width}; height: ${height}`" class="relative-position">
    <img
      v-if="src"
      :src="src"
      :class="`${width} ${height} object-cover`"
      :img-style="{
        maxWidth,
      }"
    />
    <div
      v-else
      class="full-width text-center bg-grey-4 flex items-center justify-center"
      :style="`width: ${width}; height: ${height}`"
    >
      <f-icon icon="image" />
    </div>
    <div
      v-if="caption"
      class="absolute-bottom text-caption flex items-center justify-center text-white"
      style="background-color: rgba(0, 0, 0, 0.6); height: 30%"
    >
      {{ caption }}
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue'

export default defineComponent({
  props: {
    width: {
      type: String,
      required: false,
      default: 'w-10',
    },
    height: {
      type: String,
      required: false,
      default: 'h-10',
    },
    src: {
      type: String,
      default: null,
    },
    caption: {
      type: String,
      default: null,
    },
    maxWidth: {
      type: String,
      default: null,
    },
  },
})
</script>
