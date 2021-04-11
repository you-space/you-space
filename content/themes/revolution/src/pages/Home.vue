<template>
  <q-page class="flex flex-center"> Home page </q-page>
</template>

<script lang="ts">
import { defineComponent, ref } from 'vue'

export default defineComponent({
  name: 'Home',
  setup(_, root) {
    const count = ref(0)
    return {
      count,
      increment: () => count.value++,
    }
  },
})
</script>
