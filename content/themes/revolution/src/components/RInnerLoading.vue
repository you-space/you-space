<template>
  <div v-show="model" class="w-full h-full relative">
    <div class="absolute inset-0 flex justify-center items-center text-white">
      <div class="r-spinner animate-spin"></div>
    </div>
  </div>
</template>
<script lang="ts">
import { computed, defineComponent } from 'vue'

export default defineComponent({
  props: {
    modelValue: {
      type: Boolean,
      default: false,
    },
  },
  emits: ['update:modelValue'],
  setup(props, { emit }) {
    const model = computed({
      get: () => props.modelValue,
      set: (value) => emit('update:modelValue', value),
    })
    return {
      model,
    }
  },
})
</script>

<style lang="scss">
.r-spinner {
  --color: theme(colors.blue.500);
  --bg-color: theme(colors.white);
  width: 40px;
  height: 40px;
  border: 4px solid var(--color);
  border-top: 4px solid var(--bg-color);
  border-radius: 50%;
}
</style>
