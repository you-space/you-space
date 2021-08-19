<template>
    <q-page padding>
        <ys-table
            v-model:pagination="pagination"
            :columns="columns"
            :rows="rows"
            @request="reload"
        >
            <template #body-cell-value="props">
                <q-td :props="props">
                    <q-btn
                        :label="$t('viewData')"
                        size="sm"
                        color="primary"
                        @click="viewValue(props.row)"
                    />
                </q-td>
            </template>
        </ys-table>
    </q-page>
</template>
<script lang="ts">
import lodash from 'lodash';
import { useQuasar } from 'quasar';
import { defineComponent, ref, defineAsyncComponent } from 'vue';
import { useI18n } from 'vue-i18n';
import { fetchItems, Item } from './compositions';
import { createServerPagination } from 'src/components/compositions';

export default defineComponent({
    setup() {
        const tm = useI18n();
        const quasar = useQuasar();

        const rows = ref<Item[]>([]);
        const columns = [
            {
                name: 'id',
                label: tm.t('id'),
                field: 'id',
                align: 'left',
            },
            {
                name: 'type',
                label: tm.t('type'),
                field: (item: Item) => lodash.get(item, 'type.name'),
                align: 'left',
            },
            {
                name: 'origin',
                label: tm.t('origin'),
                field: (item: Item) => lodash.get(item, 'origin.name', 'none'),
                align: 'left',
            },
            {
                name: 'visibility',
                label: tm.t('visibility'),
                field: (item: Item) => lodash.get(item, 'visibility.name'),
                align: 'left',
            },
            {
                name: 'value',
                label: tm.t('value'),
                field: 'value',
                align: 'left',
                style: { width: '150px' },
            },
        ];

        const { pagination, reload } = createServerPagination<Item>(
            fetchItems,
            (data) => {
                rows.value = data.data;
            },
        );

        function viewValue(item: Item) {
            quasar.dialog({
                component: defineAsyncComponent(
                    () => import('src/components/YsJsonViewerDialog.vue'),
                ),
                componentProps: { value: item.value },
            });
        }

        void reload({ pagination: pagination.value });

        return {
            columns,
            rows,
            pagination,
            reload,

            viewValue,
        };
    },
});
</script>
