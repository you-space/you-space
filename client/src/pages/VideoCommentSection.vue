<template>
  <div>
    <h6 class="text-h6 q-my-none q-mb-md">
      {{ $t('comments') }}
    </h6>
    <video-comment 
      v-for="(comment, index) in comments"
      :key="index"
      :comment="comment"
      bordered
      flat
      class="q-mb-md"
    >
      <q-card-section
        v-if="comment.replies.length"
        style="margin-left:56px"
      >
        <q-btn
          :label="$t('showReplies', [comment.replies.length])"
          flat
          size="sm"
          :icon="!comment.showReplies ? 'expand_more' : 'expand_less' "
          @click="comment.showReplies = !comment.showReplies"
        />
        <q-slide-transition>
          <div v-show="comment.showReplies">
            <q-card-section>
              <video-comment
                v-for="(reply, ri) in comment.replies"
                :key="ri"
                class="q-mb-md"
                :comment="reply"
              />
            </q-card-section>
          </div>
        </q-slide-transition>
      </q-card-section>
    </video-comment>
  </div>
</template>

<script lang='ts'>
import { api } from 'src/boot/axios';
import { defineComponent, defineAsyncComponent, ref, onMounted } from 'vue';



export default defineComponent({
    components: {
        VideoComment: defineAsyncComponent(() => import('./VideoCommentSectionItem.vue'))
    },
    props: {
        videoId: {
            type: String,
            required: true,
        }
    },
    setup(props){
        const comments = ref<Comment[]>([]);

        const setComments = async () => {
            const request = await api.get<Comment[]>(`/comments/${props.videoId}`);
            comments.value = request.data;
        };

        onMounted(setComments);
        
        return {
            comments
        };
    }
});
</script>

<style>

</style>