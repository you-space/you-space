<template>
    <component :is="component" />
</template>
<script lang="ts">
import { defineComponent, h, shallowRef } from 'vue';

export default defineComponent({
    props: {
        name: {
            type: String,
            required: true,
        },
    },
    setup(props) {
        const component = shallowRef({
            render: () => h('h1', 'No component'),
        });

        async function setPage() {
            const page = await import(
                /* webpackIgnore: true */
                `/api/v1/admin/dashboard/pages/${props.name}`
            );

            component.value = page.default;
        }

        void setPage();

        return {
            component,
        };
    },
});
</script>
