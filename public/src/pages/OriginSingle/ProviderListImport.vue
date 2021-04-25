<template>
    <q-btn @click="importNow">{{ $t('importNow') }}</q-btn>
</template>

<script lang="ts">
import { api } from 'src/boot/axios';
import { defineComponent, PropType } from 'vue';
import { Provider } from './ProviderList.vue';
export default defineComponent({
    props: {
        provider: {
            type: Object as PropType<Provider>,
            required: true,
        },
    },
    setup(props) {
        async function importNow() {
            const { originId, id } = props.provider;
            await api.post(
                `admin/origins/${String(originId)}/providers/${String(
                    id,
                )}/import`,
            );
        }

        return { importNow };
    },
});
</script>
