<template>
    <q-card dark class="full-width full-height q-video">
        <q-video
            v-if="isYoutubeUrl"
            class="full-width full-height ys-video"
            controls
            :src="src"
            v-bind="$attrs"
        />

        <video
            v-else
            class="full-width full-height ys-video"
            controls
            :src="src"
            v-bind="$attrs"
        />
    </q-card>
</template>

<script lang="ts">
import { defineComponent, computed } from 'vue';

export default defineComponent({
    name: 'Video',
    inheritAttrs: false,
    props: {
        src: {
            type: String,
            required: true,
        },
    },
    setup(props) {
        const isYoutubeUrl = computed(() => {
            return props.src.includes('youtube.com/embed');
        });

        return {
            isYoutubeUrl,
        };
    },
});
</script>

<style lang="scss">
.ys-video {
    object-fit: fill;
}
</style>
