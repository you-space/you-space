<template>
    <q-item-label v-if="label && showLabel" overline>
        {{ label }}
    </q-item-label>

    <q-img :src="modelValue" v-bind="$attrs" />
</template>
<script lang="ts">
import { defineComponent } from 'vue';

export default defineComponent({
    inheritAttrs: false,
    props: {
        modelValue: {
            type: String,
            default: null,
        },
        label: {
            type: String,
            default: null,
        },
        showLabel: {
            type: Boolean,
            default: false,
        },
    },
});
</script>
