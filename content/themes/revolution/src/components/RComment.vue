<template>
  <q-item v-if="comment" class="q-py-sm q-mb-sm row comment">
    <q-item-section avatar class="self-start">
      <q-avatar>
        <img :src="comment.avatarSrc" />
      </q-avatar>
    </q-item-section>
    <q-item-section>
      <span class="text-bold">{{ comment.username }}</span>
      <p class="mb-2" style="white-space: pre-line; word-break: break-word">
        {{ comment.content }}
      </p>
      <div class="flex">
        <q-btn size="0.6rem" color="grey-5" flat icon="thumb_up" :label="comment.totalLikeCount" />
        <q-btn
          size="0.6rem"
          color="grey-5"
          flat
          icon="thumb_down"
          :label="comment.totalUnlikeCount"
        />
        <q-btn
          v-if="replies.length"
          @click="showReplies = !showReplies"
          size="0.6rem"
          color="grey-5"
          flat
        >
          <span class="q-mr-sm">
            {{ $t('showReplies', [replies.length]) }}
          </span>
          <q-icon :name="showReplies ? 'expand_less' : 'expand_more'" />
        </q-btn>
      </div>
      <div v-if="replies.length" class="q-my-md" v-show="showReplies">
        <r-comment v-for="comment in replies" :key="comment.id" :comment="comment" />
      </div>
    </q-item-section>
  </q-item>
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
