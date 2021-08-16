<template>
    <q-page padding>
        <ys-table
            v-model:pagination="pagination"
            :rows="rows"
            :columns="columns"
        >
            <template #top-right>
                <q-btn :label="$t('addNew')" color="primary" @click="addType" />
            </template>

            <template #body-cell-actions="props">
                <q-td :props="props">
                    <q-btn
                        icon="edit"
                        round
                        size="sm"
                        flat
                        color="grey-5"
                        @click="editType(props.row)"
                    />
                    <q-btn
                        icon="delete"
                        round
                        size="sm"
                        flat
                        color="grey-5"
                        @click="deleteTypeById(props.row.id)"
                    />
                </q-td>
            </template>
        </ys-table>
    </q-page>
</template>
<script lang="ts">
import { useQuasar } from 'quasar';
import { createServerPagination } from 'src/components/compositions';
import { defineComponent, ref } from 'vue';
import { useI18n } from 'vue-i18n';
import { useRouter } from 'vue-router';
import { Type, fetchTypes, createType, deleteType } from './compositions';

export default defineComponent({
    setup() {
        const tm = useI18n();
        const router = useRouter();
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
                name: 'actions',
                align: 'right',
            },
        ];

        const { pagination, reload } = createServerPagination(
            fetchTypes,
            ({ data }) => {
                rows.value = data;
            },
        );

        void reload({ pagination: pagination.value });

        function editType(type: Type) {
            return router.push({
                name: 'type-single',
                params: {
                    id: type.id,
                },
            });
        }

        function addType() {
            quasar
                .dialog({
                    title: tm.t('add', [tm.t('type').toLowerCase()]),
                    prompt: {
                        model: '',
                        label: tm.t('name'),
                    },
                })
                .onOk(async (data: string) => {
                    await createType({ name: data });
                    void reload({ pagination: pagination.value });
                });
        }

        function deleteTypeById(id: number) {
            quasar
                .dialog({
                    title: tm.t('areYouSure'),
                    message: tm.t('thisActionCanNotBeUndone'),
                    cancel: true,
                })
                .onOk(async () => {
                    await deleteType(id);
                    await reload({ pagination: pagination.value });
                });
        }

        return {
            rows,
            columns,
            pagination,

            addType,
            editType,
            deleteTypeById,
        };
    },
});
</script>
