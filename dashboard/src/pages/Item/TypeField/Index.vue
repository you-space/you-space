<template>
    <q-card flat :square="isSidebar" :bordered="!isSidebar">
        <q-expansion-item v-model="expand" class="bg-grey-1">
            <template #header>
                <q-item-section>
                    {{ field.label || field.name }}
                </q-item-section>
            </template>

            <q-separator></q-separator>

            <q-skeleton v-if="loading" square style="min-height: 150px" />

            <q-card-section v-else>
                <component :is="component" v-model="model" v-bind="binds" />
            </q-card-section>
        </q-expansion-item>
    </q-card>
</template>
<script lang="ts">
import lodash from 'lodash';

import {
    defineComponent,
    PropType,
    defineAsyncComponent,
    computed,
    ref,
} from 'vue';

import {
    TypeFieldInputTypes,
    TypeField,
} from 'src/pages/ItemType/compositions';

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
        loading: {
            type: Boolean,
            default: false,
        },
        isSidebar: {
            type: Boolean,
            default: false,
        },
    },
    emits: ['update:modelValue'],
    setup(props, { emit }) {
        const expand = ref(true);

        const allComponents = {
            text: defineAsyncComponent(() => import('./Text.vue')),
            textarea: defineAsyncComponent(() => import('./Text.vue')),
            image: defineAsyncComponent(() => import('./Image.vue')),
            video: defineAsyncComponent(() => import('./Text.vue')),
        };

        let type: TypeFieldInputTypes = lodash.get(
            props.field,
            'input.type',
            'text',
        );

        if (!Object.keys(allComponents).includes(type)) {
            type = 'text';
        }

        const binds = ref<Record<string, unknown>>({
            type: type,
            readonly: props.field.type !== 'editable',
            ...props.field.input?.props,
        });

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
            expand,

            component,
            binds,
            model,
        };
    },
});
</script>
