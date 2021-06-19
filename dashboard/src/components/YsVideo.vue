<template>
    <q-card dark class="full-width full-height q-video">
        <q-video
            class="full-width full-height ys-video"
            controls
            :src="src"
            v-bind="$attrs"
        />
    </q-card>
</template>

<script lang="ts">
import { defineComponent } from 'vue';

export default defineComponent({
    name: 'Video',
    inheritAttrs: false,
    props: {
        src: {
            type: String,
            required: true,
        },
    },
    setup() {
        return {};
    },
});
</script>

<style lang="scss">
.ys-video {
    object-fit: fill;
}
</style>
