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

    <div
        v-else
        class="relative full-height full-width"
        style="min-height: 180px"
    >
        <div class="absolute-full flex flex-center bg-grey-7 text-white">
            <q-icon name="smart_display" size="7rem" />
        </div>
    </div>
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
