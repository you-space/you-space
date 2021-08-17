<template>
    <component v-bind="componentProps" :is="component" />
</template>

<script lang="ts">
import lodash from 'lodash';

import { defineComponent, PropType, resolveComponent } from 'vue';
import { TypeField } from 'src/pages/Type/compositions';

export default defineComponent({
    inheritAttrs: false,
    props: {
        field: {
            type: Object as PropType<TypeField>,
            required: true,
        },
    },
    setup(props, { attrs }) {
        const component = resolveComponent(
            props.field.options.component || 'q-input',
        );

        const componentProps = lodash.get(
            props.field,
            'options.componentProps',
            {},
        );

        if (props.field.type === 'mapped') {
            componentProps.readonly = true;
        }

        Object.assign(componentProps, attrs);

        return {
            component,
            componentProps,
        };
    },
});
</script>
