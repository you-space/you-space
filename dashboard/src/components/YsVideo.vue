<template>
    <q-video
        v-if="isYoutubeUrl && modelValue"
        class="ys-video"
        controls
        :src="modelValue"
        v-bind="$attrs"
    />

    <video
        v-else-if="modelValue"
        class="ys-video"
        controls
        :src="modelValue"
        v-bind="$attrs"
    />
</template>

<script lang="ts">
import { defineComponent, computed } from 'vue';

export default defineComponent({
    name: 'YsVideo',
    props: {
        modelValue: {
            type: String,
            default: null,
        },
    },
    setup(props) {
        const isYoutubeUrl = computed(() => {
            return (
                props.modelValue &&
                props.modelValue.includes('youtube.com/embed')
            );
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
