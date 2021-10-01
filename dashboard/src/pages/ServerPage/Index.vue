<template>
    <q-page v-if="loading">
        <q-inner-loading :showing="true" />
    </q-page>

    <component :is="component" v-else />
</template>
<script lang="ts">
import { defineComponent, h, ref, shallowRef, watch } from 'vue';

export default defineComponent({
    props: {
        name: {
            type: String,
            required: true,
        },
    },
    setup(props) {
        const loading = ref(false);

        const component = shallowRef<any>({
            render: () => h('h1', 'Loaging...'),
        });

        async function setPage() {
            loading.value = true;

            const { template, script } = await import(
                /* webpackIgnore: true */ `/api/v1/pages/${props.name}`
            );

            component.value = {
                template,
                ...script,
            };

            setTimeout(() => {
                loading.value = false;
            }, 800);
        }

        watch(() => props.name, setPage, {
            immediate: true,
        });

        return {
            component,
            loading,
        };
    },
});
</script>
