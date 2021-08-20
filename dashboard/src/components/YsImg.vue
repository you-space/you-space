<template>
    <q-item-label v-if="label && showLabel" overline>
        {{ label }}
    </q-item-label>

    <q-img :src="modelValue || 'error'" v-bind="$attrs">
        <template #error>
            <div class="absolute-full flex flex-center bg-grey-7 text-white">
                <q-icon name="image" size="3rem" />
            </div>
        </template>
    </q-img>
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
