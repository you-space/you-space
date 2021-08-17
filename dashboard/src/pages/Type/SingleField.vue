<template>
    <ys-table
        v-model:pagination="pagination"
        :title="$tc('field', 2)"
        :rows="rows"
        :columns="columns"
    >
        <template #top-right>
            <q-btn :label="$t('addNew')" color="primary" @click="addField" />
        </template>
        <template #body-cell-actions="props">
            <q-td :props="props">
                <q-btn
                    icon="edit"
                    round
                    size="sm"
                    flat
                    color="grey-5"
                    @click="editField(props.row)"
                />
                <q-btn
                    icon="delete"
                    round
                    size="sm"
                    flat
                    color="grey-5"
                    @click="deleteField(props.row)"
                />
            </q-td>
        </template>
    </ys-table>
</template>
<script lang="ts">
import { defineComponent, defineAsyncComponent, ref } from 'vue';
import { useI18n } from 'vue-i18n';
import { useQuasar } from 'quasar';

import { createServerPagination } from 'src/components/compositions';

import { TypeField, deleteTypeField, fetchTypeFields } from './compositions';

export default defineComponent({
    props: {
        typeId: {
            type: [Number, String],
            required: true,
        },
    },
    setup(props) {
        const tm = useI18n();
        const quasar = useQuasar();

        const rows = ref();

        const columns = [
            {
                name: 'name',
                label: tm.t('name'),
                field: 'name',
                align: 'left',
            },
            {
                name: 'type',
                label: tm.t('type'),
                field: 'type',
                align: 'left',
            },
            {
                name: 'actions',
                align: 'right',
            },
        ];

        const { pagination, reload } = createServerPagination(
            (filters) => fetchTypeFields(Number(props.typeId), filters),
            ({ data }) => {
                rows.value = data;
            },
        );

        void reload({ pagination: pagination.value });

        function addField() {
            quasar
                .dialog({
                    component: defineAsyncComponent(
                        () => import('./SingleFieldDialog.vue'),
                    ),
                    componentProps: {
                        typeId: props.typeId,
                    },
                })
                .onOk(() => reload({ pagination: pagination.value }));
        }

        function editField(field: TypeField) {
            quasar
                .dialog({
                    component: defineAsyncComponent(
                        () => import('./SingleFieldDialog.vue'),
                    ),
                    componentProps: {
                        typeId: props.typeId,
                        fieldId: field.id,
                    },
                })
                .onOk(() => reload({ pagination: pagination.value }));
        }

        function deleteField(field: TypeField) {
            quasar
                .dialog({
                    title: tm.t('areYouSure'),
                    message: tm.t('thisActionCanNotBeUndone'),
                    cancel: true,
                })
                .onOk(async () => {
                    await deleteTypeField(Number(props.typeId), field.id);
                    void reload({ pagination: pagination.value });
                });
        }

        return {
            rows,
            columns,
            pagination,

            editField,
            addField,
            deleteField,
        };
    },
});
</script>
