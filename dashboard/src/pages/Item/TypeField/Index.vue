<template>
    <q-skeleton v-if="loading" type="rect" />
    <component :is="component" v-else v-model="model" v-bind="binds" />
</template>
<script lang="ts">
import {
    defineComponent,
    PropType,
    defineAsyncComponent,
    computed,
    watch,
    ref,
} from 'vue';
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
        originalValue: {
            type: [String, Number, Object, Array],
            default: null,
        },
        loading: {
            type: Boolean,
            default: false,
        },
    },
    emits: ['update:modelValue'],
    setup(props, { emit }) {
        const allComponents = {
            text: defineAsyncComponent(() => import('./Text.vue')),
            textarea: defineAsyncComponent(() => import('./Text.vue')),
            image: defineAsyncComponent(() => import('./Image.vue')),
            video: defineAsyncComponent(() => import('./Video.vue')),
        };

        let type: TypeFieldInputTypes = lodash.get(
            props.field,
            'input.type',
            'text',
        );

        if (!Object.keys(allComponents).includes(type)) {
            type = 'text';
        }

        const binds = ref<Record<string, unknown>>({});

        function setBinds() {
            binds.value = {
                label: props.field.label,
                type: type,
                readonly: !props.field.input?.editable,
                originalValue: props.originalValue,
                ...props.field.input?.props,
            };

            if (['video', 'image'].includes(type)) {
                binds.value.currentValue = props.modelValue;
            }
        }

        watch(() => props.loading, setBinds, { immediate: true });

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
