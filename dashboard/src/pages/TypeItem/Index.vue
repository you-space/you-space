<template>
    <q-page padding>
        <ys-table
            v-model:pagination="pagination"
            :loading="loading"
            :rows="rows"
            :columns="computedColumns"
            :title="title"
            @request="reload"
        >
            <template #top-right>
                <q-btn
                    :label="$t('addNew')"
                    color="primary"
                    @click="addTypeItem"
                />
            </template>

            <template
                v-for="(column, index) in computedColumns.filter(
                    (c) => !!c.component,
                )"
                :key="index"
                #[`body-cell-${column.name}`]="props"
            >
                <q-td :props="props">
                    <component
                        :is="column.component"
                        v-if="column.component"
                        :model-value="props.value"
                        v-bind="column.componentProps"
                    />
                </q-td>
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
import lodash from 'lodash';

import { defineComponent, ref, computed, watch } from 'vue';
import { useI18n } from 'vue-i18n';
import { useRouter } from 'vue-router';
import { useQuasar } from 'quasar';

import { createServerPagination } from 'src/components/compositions';

import {
    Type,
    TypeField,
    findType,
    fetchTypeFields,
} from '../Type/compositions';

import {
    TypeItem,
    fetchTypeItems,
    deleteTypeItem,
    getFieldComponentName,
    getFieldComponentProps,
    getFieldProperty,
} from './compositions/index';

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
        const quasar = useQuasar();

        const loading = ref(false);

        const type = ref<Type>();
        const fields = ref<TypeField[]>([]);

        const rows = ref();

        const title = computed(() => {
            if (type.value) {
                return lodash.capitalize(
                    `${type.value.name} ${tm.t('item', 2)}`,
                );
            }
            return tm.t('item', 2);
        });

        const computedColumns = computed(() => {
            const columns: any[] = [];

            lodash(fields.value)
                .filter((f) => lodash.get(f, 'options.table.show', true))
                .orderBy((f) => lodash.get(f, 'options.table.order'))
                .forEach((field) => {
                    const component = getFieldComponentName(field, ['table']);

                    const componentProps = getFieldComponentProps(field, [
                        'table',
                    ]);

                    columns.push({
                        name: field.name,
                        field: field.name,
                        label: getFieldProperty(field, 'label', ['table']),
                        align: 'left',
                        component,
                        componentProps,
                    });
                });

            columns.push(
                {
                    name: 'visibility',
                    label: tm.t('visibility'),
                    align: 'left',
                    field: (row: TypeItem) => lodash.get(row, 'visibilityName'),
                },
                {
                    name: 'actions',
                    align: 'right',
                },
            );

            return columns;
        });

        async function setType() {
            type.value = await findType(Number(props.typeId));

            const { data } = await fetchTypeFields(Number(props.typeId));

            fields.value = data;
        }

        const { pagination, reload } = createServerPagination(
            (filters) => {
                return fetchTypeItems(Number(props.typeId), {
                    limit: filters.rowsPerPage,
                    page: filters.page,
                });
            },
            ({ data }) => {
                rows.value = data;
            },
        );

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
                    await load();
                });
        }

        async function load() {
            rows.value = [];

            loading.value = true;

            await setType();
            await reload({ pagination: pagination.value });

            setTimeout(() => (loading.value = false), 800);
        }

        watch(() => props.typeId, load, {
            immediate: true,
        });

        return {
            loading,
            rows,
            computedColumns,
            title,

            pagination,
            reload,

            addTypeItem,
            editTypeItem,
            deleteTypeItemById,
        };
    },
});
</script>
