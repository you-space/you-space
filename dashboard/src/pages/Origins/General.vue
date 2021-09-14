<template>
    <div class="q-gutter-y-md">
        <q-input
            v-model="model.name"
            class="col-4 q-pr-sm"
            :label="$t('name')"
            outlined
        />
        <q-input
            v-model="model.providerName"
            class="col-4 q-pr-sm"
            :label="$t('providerName')"
            :loading="loading"
            outlined
            readonly
        />
    </div>
</template>

<script lang="ts">
import { useVModel } from '@vueuse/core';
import { defineComponent, PropType, ref } from 'vue';
import { Origin } from './composition';

export default defineComponent({
    props: {
        origin: {
            type: Object as PropType<Origin>,
            required: true,
        },
    },
    emits: ['reload'],
    setup(props, { emit }) {
        const loading = ref(false);

        const model = useVModel(props, 'origin', emit);

        return {
            model,
            loading,
        };
    },
});
</script>
