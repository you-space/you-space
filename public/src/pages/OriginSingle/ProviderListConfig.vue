<template>
    <div class="flex q-mb-md">
        <h2 class="text-h6 q-my-none text-bold col-grow">
            {{ $t('config') }} - {{ providerName }}
        </h2>
        <div class="q-gutter-sm">
            <q-btn
                :label="$t('delete')"
                color="negative"
                @click="showDeleteDialog"
            />
            <q-btn
                :loading="loading"
                :label="$t('save')"
                color="primary"
                @click="save"
            />
        </div>
    </div>
    <div class="row full-width">
        <div
            v-for="(field, index) in configFields"
            :key="index"
            class="q-mb-sm col-12 row items-center"
        >
            <q-input
                v-model="field.name"
                class="col-4 q-pr-sm"
                :label="$t('name')"
                :readonly="field.isRequired"
                outlined
                dense
            />
            <q-input
                v-model="field.value"
                class="col q-px-sm"
                :label="$t('value')"
                outlined
                dense
            />
            <q-btn
                v-if="!field.isRequired"
                icon="close"
                flat
                class="full-height"
                @click="removeField(field)"
            />
        </div>
        <q-btn :label="$t('addNew')" @click="addField" />
    </div>
</template>
<script lang="ts">
import { api } from 'src/boot/axios';
import { defineComponent, ref, PropType, watch } from 'vue';
import { useQuasar } from 'quasar';
import { useI18n } from 'vue-i18n';

interface ProviderField {
    name: string;
}

interface Field {
    name: string;
    value: string;
    isRequired?: boolean;
}

export default defineComponent({
    props: {
        providerName: {
            type: String,
            required: true,
        },
        fields: {
            type: Array as PropType<ProviderField[]>,
            default: () => [],
        },
        config: {
            type: Object as PropType<Record<string, string>>,
            default: () => ({}),
        },
        originId: {
            type: [String, Number],
            required: true,
        },
    },
    emits: ['save'],
    setup(props, { emit }) {
        const quasar = useQuasar();
        const tm = useI18n();

        const configFields = ref<Field[]>([]);
        const loading = ref(false);

        function setFields() {
            const fieldsValues = Object.entries(props.config).map(
                ([key, value]) => ({
                    name: key,
                    value,
                }),
            );

            configFields.value = props.fields.map((f) => {
                const configValue = fieldsValues.find(
                    (fv) => fv.name === f.name,
                );
                return {
                    isRequired: true,
                    ...f,
                    value: configValue ? configValue.value : '',
                };
            });

            fieldsValues
                .filter(
                    (f) => !configFields.value.some((cf) => cf.name === f.name),
                )
                .forEach((fv) => {
                    configFields.value.push({
                        name: fv.name,
                        value: fv.value,
                    });
                });
        }

        watch(() => props.providerName, setFields, { immediate: true });

        function removeField(field: Field) {
            const index = configFields.value.indexOf(field);
            if (index != -1) {
                configFields.value.splice(index, 1);
            }
        }

        function addField() {
            configFields.value.push({
                name: '',
                value: '',
            });
        }

        async function save() {
            loading.value = true;

            const config = configFields.value.reduce((result, field) => {
                return {
                    ...result,
                    [field.name]: field.value,
                };
            }, {});

            await api
                .patch(
                    `admin/origins/${props.originId}/providers/${props.providerName}`,
                    { config },
                )
                .catch(() => (loading.value = false));

            setTimeout(() => {
                loading.value = false;
                emit('save');
            }, 800);
        }

        async function deleteProvider() {
            await api.delete(
                `admin/origins/${props.originId}/providers/${props.providerName}`,
            );

            emit('save');
        }

        function showDeleteDialog() {
            quasar
                .dialog({
                    title: tm.t('areYouSure'),
                    message: tm.t('thisActionCanNotBeUndone'),
                    cancel: true,
                })
                .onOk(deleteProvider);
        }

        return {
            loading,
            configFields,
            addField,
            removeField,
            save,
            showDeleteDialog,
        };
    },
});
</script>
