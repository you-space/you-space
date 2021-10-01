<template>
    <q-page v-if="loading">
        <q-inner-loading :showing="true" />
    </q-page>

    <template v-else> </template>

    <!-- <component :is="component" v-else /> -->
</template>
<script lang="ts">
import { api } from 'src/boot/axios';
import { defineComponent, h, ref, shallowRef, watch, compile } from 'vue';

export default defineComponent({
    props: {
        name: {
            type: String,
            required: true,
        },
    },
    setup(props) {
        const loading = ref(false);

        const component = shallowRef({
            render: () => h('h1', 'No component'),
        });

        async function setPage() {
            loading.value = true;

            // const page = await import(
            //     /* webpackIgnore: true */
            //     `/api/v1/pages/${props.name}`
            // );

            // const { data: template } = await api.get(
            //     `pages/${props.name}/template`,
            // );
            // const { data: script } = await api.get(
            //     `pages/${props.name}/script`,
            // );
            // const { data: css } = await api.get(`pages/${props.name}/css`);

            // console.log(template, script, css);

            // import('/api/v1/pages/${name}/script`)

            // console.log(page);
            // console.log(compile(page));

            // component.value = compile(page) as any;

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
