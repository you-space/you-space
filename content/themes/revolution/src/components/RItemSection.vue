<template>
  <div :class="classes">
    <slot />
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue'

export default defineComponent({
  props: {
    side: {
      type: Boolean,
      default: false,
    },
  },
  setup(props) {
    const classes: string[] = []

    if (props.side) {
      classes.push('flex-grow-0')
    } else {
      classes.push('flex-1')
    }

    return {
      classes,
    }
  },
})
</script>
