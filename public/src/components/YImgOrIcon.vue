<template>
    <div
        :style="`width: ${width}; height: ${height}`"
        class="relative-position"
    >
        <q-img v-if="src" :src="src" :width="width" :height="height" />
        <div
            v-else
            class="full-width text-center bg-grey-4 flex items-center justify-center"
            :style="`width: ${width}; height: ${height}`"
        >
            <q-icon size="md" name="insert_photo" />
        </div>
        <div
            v-if="caption"
            class="absolute-bottom text-caption flex items-center justify-center text-white"
            style="background-color: rgba(0, 0, 0, 0.6); height: 30%"
        >
            {{ caption }}
        </div>
    </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';

export default defineComponent({
    props: {
        width: {
            type: String,
            required: false,
            default: '100px',
        },
        height: {
            type: String,
            required: false,
            default: '50px',
        },
        src: {
            type: String,
            default: null,
        },
        caption: {
            type: String,
            default: null,
        },
    },
    setup() {},
});
</script>
