<template>
    <q-page padding>
        <ys-table
            v-model:pagination="pagination"
            :columns="columns"
            :rows="rows"
            @request="reload"
        >
            <template #body-cell="props">
                <q-td :props="props">
                    <q-img
                        v-if="props.col.type === 'image'"
                        :src="props.value"
                        height="68px"
                        width="120px"
                    />

                    <template v-else-if="props.col.type === 'date'">
                        {{ getDate(props.value) }}
                    </template>

                    <template v-else-if="props.col.type === 'datetime'">
                        {{ getDatetime(props.value, 'long') }}
                    </template>

                    <template v-else-if="props.col.type === 'number'">
                        {{ getNumber(props.value) }}
                    </template>

                    <template v-else>
                        {{ props.value }}
                    </template>
                </q-td>
            </template>
            <template #body-cell-actions="props">
                <q-td :props="props">
                    <q-btn
                        color="grey-6"
                        size="sm"
                        icon="edit"
                        flat
                        round
                        :to="getItemTo(props.row)"
                    />
                    <q-btn color="grey-6" size="sm" icon="delete" flat round />
                </q-td>
            </template>
        </ys-table>
    </q-page>
</template>
<script lang="ts">
import lodash from 'lodash';
import { date } from 'quasar';
import { defineComponent, ref, onMounted } from 'vue';
import { useI18n } from 'vue-i18n';

import { api } from 'src/boot/axios';

import { fetchItems, Item } from 'src/pages/Item/compositions';
import { ItemType, TypeField } from 'src/pages/ItemType/compositions';
import { createServerPagination } from 'src/components/compositions';

export default defineComponent({
    props: {
        type: {
            type: String,
            required: true,
            default: null,
        },
    },
    setup(props) {
        const tm = useI18n();

        const rows = ref<Item[]>([]);
        const type = ref<Partial<ItemType>>({
            name: '',
            options: {},
        });

        const columns = ref<Record<string, string>[]>([
            {
                name: 'id',
                label: '#',
                field: 'id',
                align: 'left',
            },
            {
                name: 'visibility',
                label: tm.t('visibility'),
                field: 'visibilityName',
                align: 'left',
            },
        ]);

        const { pagination, reload } = createServerPagination<Item>(
            (pagination) =>
                fetchItems({
                    typeId: type.value.id,
                    serialize: true,
                    ...pagination,
                }),
            (data) => {
                rows.value = data.data;
            },
        );

        async function setType() {
            const { data } = await api.get(`item-types/${props.type}`);
            type.value = data;
        }

        async function setColumns() {
            const { data } = await api.get(`item-types/${props.type}/fields`);

            const fields: TypeField[] = data || [];

            const filteredFields = fields.filter(
                (f) => f.table?.show === true || f.table?.show === undefined,
            );

            lodash
                .orderBy(filteredFields, (i) => i.table?.order)
                .forEach((field) => {
                    columns.value.push({
                        name: field.name,
                        label: field.label,
                        type: lodash.get(field, 'table.type', 'text'),
                        field: field.name,
                        align: 'left',
                    });
                });

            columns.value.push({ name: 'actions' });
        }

        onMounted(async () => {
            await setType();
            await setColumns();
            await reload({ pagination: pagination.value });
        });

        function getItemTo(item: Item) {
            return {
                name: 'item-single',
                params: { id: item.id },
            };
        }

        function isImgPath(path: string | Record<string, string>) {
            if (typeof path !== 'string') {
                return false;
            }
            const extname = path.split('.').pop();

            if (!extname) {
                return false;
            }

            const extensions = ['jpg', 'png'];
            return extensions.includes(extname);
        }

        function getDatetime(value: string) {
            if (typeof value !== 'string' || !value) {
                return '';
            }

            if (!date.isValid(value)) {
                return 'invalid date';
            }

            return tm.d(value, 'long');
        }

        function getDate(value: string) {
            if (typeof value !== 'string' || !value) {
                return '';
            }

            if (!date.isValid(value)) {
                return 'invalid date';
            }

            return tm.d(value);
        }

        function getNumber(value: string | Record<string, string>) {
            if (!value) {
                return '';
            }

            if (isNaN(Number(value))) {
                return 'invalid number';
            }

            return tm.n(Number(value));
        }

        return {
            columns,
            rows,
            pagination,
            reload,

            getItemTo,
            getDatetime,
            getDate,
            getNumber,
            isImgPath,
        };
    },
});
</script>
