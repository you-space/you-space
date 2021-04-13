<template>
  <router-link :class="classes" exact-active-class="bg-gray-300" v-if="to" :to="to">
    <slot />
  </router-link>
  <li v-else :class="classes">
    <slot />
  </li>
</template>
<script lang="ts">
import { defineComponent } from 'vue'

export default defineComponent({
  props: {
    to: {
      type: Object,
      default: null,
    },
    clickable: {
      type: Boolean,
      default: false,
    },
  },
  setup(props) {
    const classes = ['flex px-4  py-3']
    const clickableClasses = 'transition-all hover:bg-gray-200 cursor-pointer'

    if (props.to || props.clickable) {
      classes.push(clickableClasses)
    }

    return {
      classes,
    }
  },
})
</script>
