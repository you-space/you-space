<template>
  <button :class="classes">
    <template v-if="icon">
      <f-icon :icon="icon" :class="label ? 'mr-2' : ''" />
    </template>
    <template v-if="label">
      {{ label }}
    </template>

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
    const classes = ref(['px-3 py-2 flex items-center'])
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
