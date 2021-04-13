<template>
  <r-item v-if="comment" class="mb-2 pl-0">
    <r-item-section side>
      <r-avatar>
        <r-img :src="comment.avatarSrc" />
      </r-avatar>
    </r-item-section>

    <r-item-section class="px-4">
      <span class="font-bold leading-none">{{ comment.username }}</span>
      <p style="white-space: pre-line; word-break: break-word">
        {{ comment.content }}
      </p>
      <div class="flex text-sm">
        <r-btn flat color="gray-400" icon="thumbs-up" :label="comment.totalLikeCount" />
        <r-btn flat color="gray-400" icon="thumbs-down" :label="comment.totalUnlikeCount" />

        <r-btn v-if="replies.length" @click="showReplies = !showReplies" flat color="gray-400">
          <span class="mr-2">
            {{ $t('showReplies', [replies.length]) }}
          </span>

          <f-icon
            icon="chevron-down"
            class="transition-transform transform"
            :class="showReplies ? 'rotate-180' : ''"
          />
        </r-btn>
      </div>
      <div v-if="replies.length" class="my-4" v-show="showReplies">
        <r-comment v-for="comment in replies" :key="comment.id" :comment="comment" />
      </div>
    </r-item-section>
  </r-item>
</template>
<script lang="ts">
import { defineComponent, ref } from 'vue'

export default defineComponent({
  props: {
    comment: {
      type: Object,
      required: false,
    },
    replies: {
      type: Array,
      required: false,
      default: () => [],
    },
  },
  setup() {
    const showReplies = ref(false)
    return {
      showReplies,
    }
  },
})
</script>
