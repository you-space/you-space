<template>
  <div>
    <h6 class="text-h6 q-my-none q-mb-md">
      {{ $t('comments') }}
    </h6>
    <q-infinite-scroll
      :offset="250"
      :disable="disable"
      @load="addNexPage"
    >
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
      <template #loading>
        <div class="row justify-center q-my-md">
          <q-spinner-dots
            color="primary"
            size="40px"
          />
        </div>
      </template>
    </q-infinite-scroll>
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
        const disable = ref(false);

        const getComments = async (page: number) => {
            const request = await api.get<Comment[]>(`/comments/${props.videoId}`, {
                params: {
                    page 
                }
            });
            
            return request.data;
        };

        const addNexPage = async (index: number, done: () => void) => {
            const page = await getComments(index);
            if (page.length === 0) {
                disable.value = true;
                done();
            }

            setTimeout(() => {
                comments.value = comments.value.concat(page);
                done();
            }, 1500);

        };

        onMounted(async () => {
            comments.value = await getComments(1);
        });
        
        return {
            comments,
            disable,
            addNexPage
        };
    }
});
</script>

<style>

</style>