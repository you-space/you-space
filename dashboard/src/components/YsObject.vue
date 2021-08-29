<template>
    <div class="row full-width">
        <div v-if="label" class="col-12 text-bold q-my-md">
            {{ label }}
            <q-separator class="q-my-md"></q-separator>
        </div>
        <div v-for="(field, index) in fields" :key="index" class="col-12 row">
            <q-input
                filled
                class="col-4 q-pr-sm q-mb-md"
                :model-value="field.name"
                :label="$t('name')"
                @update:model-value="(v) => setValue(field, 'name', v)"
            />
            <q-select
                filled
                class="col-4 q-pl-sm q-mb-md"
                :options="typeOptions"
                :model-value="field.type"
                :label="$t('type')"
                @update:model-value="(v) => setValue(field, 'type', v)"
            />

            <q-input
                filled
                class="col-4 q-pl-sm q-mb-md"
                :model-value="field.value"
                :label="$t('value')"
                @update:model-value="(v) => setValue(field, 'value', v)"
            >
                <template #after>
                    <q-btn
                        class="self-end"
                        icon="delete"
                        round
                        flat
                        @click="removeField(index)"
                    />
                </template>
            </q-input>
        </div>

        <div class="col-12 q-mt-md">
            <q-btn
                :label="$t('add', ['field'])"
                flat
                color="primary"
                @click="addField"
            />
        </div>
    </div>
</template>
<script lang="ts">
import { useVModel } from '@vueuse/core';
import { defineComponent, ref, watch } from 'vue';

interface Field {
    name: string;
    type: string;
    value: any;
}

export default defineComponent({
    props: {
        label: {
            type: String,
            required: false,
            default: '',
        },
        modelValue: {
            type: Object,
            required: false,
            default: () => ({}),
        },
        initialValue: {
            type: Object,
            required: false,
            default: () => ({}),
        },
    },
    setup(props, { emit }) {
        const model = useVModel(props, 'modelValue', emit);

        const fields = ref<Field[]>([]);

        const typeOptions = ['string', 'number', 'boolean'];

        function setFields() {
            fields.value = Object.entries(props.initialValue).map(
                ([key, value]) => ({
                    name: key,
                    type: typeof value,
                    value,
                }),
            );
        }

        watch(() => props.initialValue, setFields, {
            immediate: true,
            deep: true,
        });

        function updateModel() {
            fields.value = fields.value.slice().filter((f) => f.name !== '');

            model.value = fields.value.reduce((all, field) => {
                if (field.type === 'boolean') {
                    field.value = field.value === 'true' || true;
                }

                if (field.type === 'number') {
                    field.value = Number(field.value);
                }

                return {
                    ...all,
                    [field.name]: field.value,
                };
            }, {});
        }

        function setValue(field: Field, property: keyof Field, value: any) {
            field[property] = value;

            updateModel();
        }

        function addField() {
            fields.value.push({
                name: 'new',
                type: 'string',
                value: 'new',
            });
        }

        function removeField(index: number) {
            fields.value.splice(index, 1);
        }

        return {
            model,
            fields,
            typeOptions,

            addField,
            setValue,
            removeField,
        };
    },
});
</script>
