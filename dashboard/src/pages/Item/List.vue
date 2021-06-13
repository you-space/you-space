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
import { useQuasar, date } from 'quasar';
import { defineComponent, ref, defineAsyncComponent, onMounted } from 'vue';
import { useI18n } from 'vue-i18n';
import { fetchItems, Item, ItemType } from 'src/pages/Item/compositions';
import { createServerPagination } from 'src/components/compositions';
import { api } from 'src/boot/axios';
import lodash from 'lodash';

export default defineComponent({
    props: { type: { type: String, required: true } },
    setup(props) {
        const tm = useI18n();
        const quasar = useQuasar();

        const rows = ref<Item[]>([]);
        const type = ref({
            name: '',
            options: {},
        });

        const columns = ref<any[]>([
            {
                name: 'id',
                label: tm.t('id'),
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
            (pagination) => fetchItems(props.type, pagination),
            (data) => {
                rows.value = data.data;
            },
        );

        async function setColumns() {
            const { data } = await api.get(`admin/item-types/${props.type}`);
            type.value = data;

            const fields: ItemType['options']['fields'] = lodash.get(
                data,
                'options.fields',
                [],
            );

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

        function getNumber(value: string | Record<string, string>) {
            if (!value) {
                return '';
            }

            if (isNaN(Number(value))) {
                return 'invalid number';
            }

            return tm.n(Number(value));
        }

        function getColunmType(name: string) {
            console.log(name);
            return 'text';
        }

        return {
            columns,
            rows,
            pagination,
            reload,

            getColunmType,
            getItemTo,
            getDatetime,
            getNumber,
            isImgPath,
        };
    },
});
</script>
