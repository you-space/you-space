<template>
    <q-btn @click="importNow">{{ $t('importNow') }}</q-btn>
</template>

<script lang="ts">
import { defineComponent, PropType } from 'vue';
import { Origin, importOriginData } from './composition';

export default defineComponent({
    props: {
        origin: {
            type: Object as PropType<Origin>,
            required: true,
        },
    },
    setup(props) {
        async function importNow() {
            await importOriginData(props.origin.id);
        }

        return { importNow };
    },
});
</script>
