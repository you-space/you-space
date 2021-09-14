<template>
    <component v-bind="componentProps" :is="component" v-model="model" />
</template>

<script lang="ts">
import lodash from 'lodash';

import { defineComponent, PropType, resolveComponent, computed } from 'vue';
import { TypeField } from 'src/pages/Type/compositions';
import {
    getFieldComponentProps,
    getFieldComponentName,
    getFieldProperty,
} from './compositions/index';

export default defineComponent({
    inheritAttrs: false,
    props: {
        field: {
            type: Object as PropType<TypeField>,
            required: true,
        },
        modelValue: {
            type: [String, Number, File],
            default: null,
        },
    },
    emits: ['update:modelValue'],
    setup(props, { attrs: baseAttrs, emit }) {
        const model = computed({
            get() {
                return props.modelValue;
            },
            set(value) {
                emit('update:modelValue', value);
            },
        });

        const component = getFieldComponentName(props.field, ['single']);

        const componentProps = getFieldComponentProps(props.field, ['single']);

        const attrs = lodash.clone(baseAttrs);

        Object.assign(componentProps, attrs);

        Object.assign(componentProps, {
            label: getFieldProperty(props.field, 'label', ['single']),
            name: props.field.name,
        });

        return {
            model,
            component: resolveComponent(component || 'q-input'),
            componentProps: componentProps,
        };
    },
});
</script>
