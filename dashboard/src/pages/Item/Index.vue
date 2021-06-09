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
import { useQuasar } from 'quasar';
import { defineComponent, ref, defineAsyncComponent } from 'vue';
import { useI18n } from 'vue-i18n';
import { AllItem, fetchAllItems } from './compositions';
import { createServerPagination } from 'src/components/compositions';

export default defineComponent({
    setup() {
        const tm = useI18n();
        const quasar = useQuasar();

        const rows = ref<AllItem[]>([]);
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
                field: 'typeName',
                align: 'left',
            },
            {
                name: 'origin',
                label: tm.t('origin'),
                field: 'originName',
                align: 'left',
            },
            {
                name: 'visibility',
                label: tm.t('visibility'),
                field: 'visibilityName',
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

        const { pagination, reload } = createServerPagination<AllItem>(
            fetchAllItems,
            (data) => {
                rows.value = data.data;
            },
        );

        function viewValue(item: AllItem) {
            quasar.dialog({
                component: defineAsyncComponent(
                    () => import('src/components/YsJsonViwerDialog.vue'),
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
