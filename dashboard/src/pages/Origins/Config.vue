<template>
    <q-scroll-area style="height: 200px">
        <div class="row full-width q-pr-md">
            <div
                v-for="(field, index) in fields"
                :key="index"
                class="q-mb-sm col-12 row items-center"
            >
                <q-input
                    :model-value="field.name"
                    class="col-4 q-pr-sm"
                    :label="$t('name')"
                    :readonly="field.required"
                    outlined
                    @update:model-value="
                        (value) => setValue(field, 'name', value)
                    "
                />

                <q-input
                    :model-value="field.value"
                    class="col q-px-sm"
                    :label="$t('value')"
                    outlined
                    @update:model-value="
                        (value) => setValue(field, 'value', value)
                    "
                />
                <q-btn
                    v-if="!field.isRequired"
                    icon="close"
                    flat
                    class="full-height"
                    round
                    @click="removeField(field)"
                    @update:model-value="fields.slice()"
                />
            </div>
        </div>
        <q-btn
            class="q-mt-md"
            color="primary"
            flat
            :label="$t('addNew')"
            @click="addField"
        />
    </q-scroll-area>
</template>
<script lang="ts">
import { useVModel } from '@vueuse/core';
import { defineComponent, ref, PropType, computed, watch } from 'vue';

import { Origin } from './composition';

interface Field {
    name: string;
    value: string;
    isRequired?: boolean;
}

export default defineComponent({
    props: {
        origin: {
            type: Object as PropType<Origin>,
            required: true,
        },
    },
    emits: ['reload'],
    setup(props, { emit }) {
        const loading = ref(false);

        const model = useVModel(props, 'origin', emit);

        const fields = computed({
            get() {
                return Object.entries(model.value.config).map(
                    ([key, value]) => ({
                        name: key,
                        required: model.value.fields.some(
                            (f) => f.name === key,
                        ),
                        value,
                    }),
                );
            },
            set(value: Origin['fields']) {
                model.value.config = value
                    .filter((f) => f.name !== '')
                    .reduce(
                        (all, f) => ({
                            ...all,
                            [f.name]: f.value,
                        }),
                        {},
                    );
            },
        });

        model.value.fields
            .filter((f) => !model.value.config[f.name])
            .forEach((f) => (model.value.config[f.name] = ''));

        function addField() {
            model.value.config['new'] = '';
        }

        function removeField(field: Field) {
            delete model.value.config[field.name];
        }

        function setValue(
            field: Field,
            property: 'name' | 'value',
            value: string,
        ) {
            field[property] = value;

            fields.value = fields.value.slice();
        }

        return {
            loading,
            model,
            fields,

            addField,
            removeField,
            setValue,
        };
    },
});
</script>
