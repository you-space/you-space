<template>
    <component :is="component" v-model="model" v-bind="binds" />
</template>
<script lang="ts">
import { defineComponent, PropType, defineAsyncComponent, computed } from 'vue';
import { TypeFieldInputTypes, TypeField } from 'src/pages/Item/compositions';
import lodash from 'lodash';

export default defineComponent({
    name: 'TypeField',
    props: {
        modelValue: {
            type: [String, Number, Object, Array],
            default: null,
        },
        field: {
            type: Object as PropType<TypeField>,
            required: true,
            default: () => ({}),
        },
    },
    emits: ['update:modelValue'],
    setup(props, { emit }) {
        const allComponents = {
            text: defineAsyncComponent(() => import('./Text.vue')),
            textarea: defineAsyncComponent(() => import('./Text.vue')),
            image: defineAsyncComponent(() => import('./Image.vue')),
        };

        let type: TypeFieldInputTypes = lodash.get(
            props.field,
            'input.type',
            'text',
        );

        if (!Object.keys(allComponents).includes(type)) {
            type = 'text';
        }

        const binds = {
            label: props.field.label,
            type: type,
            readonly: !props.field.input?.editable,
            ...props.field.input?.props,
        };

        const model = computed({
            get() {
                return props.modelValue;
            },
            set(value) {
                emit('update:modelValue', value);
            },
        });

        const component = allComponents[type];

        return {
            component,
            binds,
            model,
        };
    },
});
</script>
