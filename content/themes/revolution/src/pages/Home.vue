<template>
  <div class="home">Home page</div>
</template>

<script lang="ts">
import { defineComponent, ref } from 'vue'

export default defineComponent({
  name: 'Home',
  setup() {
    const count = ref(0)
    return {
      count,
      increment: () => count.value++,
    }
  },
})
</script>
