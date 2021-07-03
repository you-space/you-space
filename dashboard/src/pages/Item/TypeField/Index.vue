<template>
    <q-card flat :square="isSidebar" :bordered="!isSidebar">
        <q-expansion-item v-model="expand" class="bg-grey-1">
            <template #header>
                <q-item-section>
                    {{ field.label || field.name }}
                </q-item-section>

                <q-item-section
                    v-if="expand && modelValue !== originalValue"
                    side
                >
                    <q-icon name="more_vert" @click.stop="">
                        <q-menu>
                            <q-list style="min-width: 150px">
                                <q-item
                                    v-close-popup
                                    clickable
                                    @click="tab = 'original'"
                                >
                                    <q-item-section>
                                        {{ $t('show', ['original']) }}
                                    </q-item-section>
                                </q-item>
                                <q-item
                                    v-close-popup
                                    clickable
                                    @click="tab = 'current'"
                                >
                                    <q-item-section>
                                        {{ $t('show', ['current']) }}
                                    </q-item-section>
                                </q-item>
                            </q-list>
                        </q-menu>
                    </q-icon>
                </q-item-section>
            </template>

            <q-separator></q-separator>

            <q-skeleton v-if="loading" square style="min-height: 150px" />

            <q-tab-panels v-else v-model="tab" animated>
                <q-tab-panel name="original">
                    <component
                        :is="component"
                        v-bind="binds"
                        :model-value="originalValue"
                        :current-value="originalValue"
                        readonly
                    />
                </q-tab-panel>

                <q-tab-panel name="current">
                    <component :is="component" v-model="model" v-bind="binds" />
                </q-tab-panel>
            </q-tab-panels>
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
    watch,
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
        originalValue: {
            type: [String, Number, Object, Array],
            default: null,
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
        const tab = ref('current');
        const expand = ref(true);

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
            tab,
            expand,

            component,
            binds,
            model,
        };
    },
});
</script>
