<template>
    <q-page padding>
        <ys-table
            v-model:pagination="pagination"
            :rows="rows"
            :columns="computedColumns"
            :title="title"
        >
            <template #top-right>
                <q-btn
                    :label="$t('addNew')"
                    color="primary"
                    @click="addTypeItem"
                />
            </template>

            <template #body-cell-actions="props">
                <q-td :props="props">
                    <q-btn
                        icon="edit"
                        round
                        size="sm"
                        flat
                        color="grey-5"
                        @click="editTypeItem(props.row)"
                    />
                    <q-btn
                        icon="delete"
                        round
                        size="sm"
                        flat
                        color="grey-5"
                        @click="deleteTypeItemById(props.row.id)"
                    />
                </q-td>
            </template>
        </ys-table>
    </q-page>
</template>
<script lang="ts">
import { capitalize } from 'lodash';

import { useQuasar } from 'quasar';
import { createServerPagination } from 'src/components/compositions';
import { defineComponent, ref, computed } from 'vue';
import { useI18n } from 'vue-i18n';
import { useRouter, useRoute } from 'vue-router';

import {
    Type,
    TypeField,
    findType,
    fetchTypeFields,
} from '../Type/compositions';

import { TypeItem, fetchTypeItems, deleteTypeItem } from './compositions';

export default defineComponent({
    props: {
        typeId: {
            type: [Number, String],
            required: true,
        },
    },
    setup(props) {
        const tm = useI18n();
        const router = useRouter();
        const route = useRoute();
        const quasar = useQuasar();

        const type = ref<Type>();
        const fields = ref<TypeField[]>();

        const rows = ref();

        const title = computed(() => {
            if (type.value) {
                return capitalize(`${type.value.name} ${tm.t('item', 2)}`);
            }
            return tm.t('item', 2);
        });

        const computedColumns = computed(() => {
            const columns: any[] = [
                {
                    name: 'id',
                    label: '#',
                    field: 'id',
                    align: 'left',
                },
            ];

            fields.value?.forEach((field) => {
                columns.push({
                    name: field.name,
                    label: capitalize(field.name),
                    field: field.name,
                    align: 'left',
                });
            });

            columns.push({
                name: 'actions',
                align: 'right',
            });

            return columns;
        });

        async function setType() {
            type.value = await findType(Number(props.typeId));

            const { data } = await fetchTypeFields(Number(props.typeId));

            fields.value = data;
        }

        void setType();

        const { pagination, reload } = createServerPagination(
            (filters) => fetchTypeItems(Number(props.typeId), filters),
            ({ data }) => {
                rows.value = data;
            },
        );

        void reload({ pagination: pagination.value });

        function addTypeItem() {
            return router.push({
                name: 'type-item-new',
            });
        }

        function editTypeItem(item: TypeItem) {
            return router.push({
                name: 'type-item-single',
                params: {
                    typeId: props.typeId,
                    itemId: item.id,
                },
            });
        }

        function deleteTypeItemById(id: number) {
            quasar
                .dialog({
                    title: tm.t('areYouSure'),
                    message: tm.t('thisActionCanNotBeUndone'),
                    cancel: true,
                })
                .onOk(async () => {
                    await deleteTypeItem(Number(props.typeId), id);
                    await reload({ pagination: pagination.value });
                });
        }

        return {
            rows,
            computedColumns,
            title,

            pagination,

            addTypeItem,
            editTypeItem,
            deleteTypeItemById,
        };
    },
});
</script>
