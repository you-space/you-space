<template>
  <q-card
    flat
    class="q-mb-md"
  >
    <q-item>
      <q-item-section avatar>
        <q-avatar class="bg-blue-grey-1">
          <img
            v-if="comment.avatarSrc"
            :src="comment.avatarSrc"
          >
          <q-icon
            v-else
            name="person"
          />
        </q-avatar>
      </q-item-section>

      <q-item-section>
        <q-item-label v-text="comment.username" />
        <q-item-label
          caption
          v-text="comment.content"
        />
          
        <q-item-label>
          <q-btn
            flat
            color="blue-grey-3"
            icon="thumb_up"
            size="sm"
            :label="comment.totalLikeCount || undefined"
          />
          <q-btn
            flat
            color="blue-grey-3"
            icon="thumb_down"
            size="sm"
            :label="comment.totalUnlikeCount || undefined"
          />
        </q-item-label>
      </q-item-section>
    </q-item>
    <slot />
  </q-card>
</template>

<script lang='ts'>
import { PropType, defineComponent } from 'vue';
import { Comment } from 'src/types/video';

export default defineComponent({
    props: {
        comment: {
            type: Object as PropType<Comment>,
            required: true
        }
    },
    setup(){
        return {
            
        };
    }
});
</script>

<style>

</style>