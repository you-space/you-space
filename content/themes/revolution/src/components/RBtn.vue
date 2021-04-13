<template>
  <button :class="classes">
    <div v-if="icon" class="mr-2">
      <f-icon :icon="icon" />
    </div>
    <div v-if="label">
      {{ label }}
    </div>

    <slot />
  </button>
</template>
<script lang="ts">
import { defineComponent, ref } from 'vue'

export default defineComponent({
  props: {
    label: {
      type: [String, Number],
      default: null,
    },
    icon: {
      type: String,
      default: null,
    },
    color: {
      type: String,
      default: 'gray-500',
    },
    flat: {
      type: Boolean,
      default: false,
    },
  },
  setup(props) {
    const classes = ref(['px-2 py-1 flex items-center'])
    if (!props.flat) {
      classes.value.push(props.color)
    } else {
      classes.value.push(`text-${props.color}`)
    }

    return {
      classes,
    }
  },
})
</script>
