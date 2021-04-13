<template>
  <div class="transition-all bg-white overflow-hidden" :class="model ? 'w-64' : 'w-0'">
    <slot />
  </div>
</template>
<script lang="ts">
import { computed, defineComponent } from 'vue'

export default defineComponent({
  props: {
    modelValue: {
      type: Boolean,
      required: false,
      default: false,
    },
  },
  emits: ['update:modelValue'],
  setup(props, { emit }) {
    const model = computed({
      get: () => props.modelValue,
      set: (value) => {
        emit('update:modelValue', value)
      },
    })
    return {
      model,
    }
  },
})
</script>
