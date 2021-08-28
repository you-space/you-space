<template>
    <q-page padding>
        <ys-table
            :selected="selected"
            selection="multiple"
            row-key="id"
            :rows="rows"
            :columns="columns"
            :title="$tc('job', 2)"
            :pagination="initialPagination"
            @selection="onSelection"
        >
            <template #top-right>
                <q-btn
                    color="negative"
                    :label="$t('deleteOrCancelSelected')"
                    @click="deleteSelected"
                />
            </template>

            <template #header-selection>
                <q-checkbox
                    color="grey-7"
                    :model-value="selected.length ? true : false"
                    @update:model-value="
                        selected.length
                            ? onSelection({ rows: [] })
                            : onSelection({ rows: rows })
                    "
                />
            </template>

            <template #body-cell-status="props">
                <q-td :props="props">
                    <q-badge size="md" :color="getColor(props.value)">
                        {{ props.value }}
                    </q-badge>
                </q-td>
            </template>

            <template #body-cell-actions="props">
                <q-td :props="props">
                    <q-btn
                        v-if="props.row.status === 'failed'"
                        icon="delete"
                        round
                        size="sm"
                        flat
                        color="grey-7"
                        @click="deleteSingle(props.row)"
                    />
                    <q-btn
                        v-if="props.row.status === 'waiting'"
                        icon="close"
                        round
                        size="sm"
                        flat
                        color="grey-7"
                        @click="deleteSingle(props.row)"
                    >
                        <q-tooltip>
                            {{ $t('cancel') }}
                        </q-tooltip>
                    </q-btn>
                </q-td>
            </template>
        </ys-table>
    </q-page>
</template>

<script lang="ts">
import { defineComponent, ref } from 'vue';
import { useI18n } from 'vue-i18n';
import { useIntervalFn } from '@vueuse/core';

import { fetchJobs, updateJobs, Job } from './compositions';
import { useQuasar } from 'quasar';

export default defineComponent({
    setup() {
        const tm = useI18n();
        const quasar = useQuasar();

        const rows = ref<Job[]>([]);
        const selected = ref<Job[]>([]);
        const loading = ref(false);

        const initialPagination = {
            sortBy: 'status',
            descending: false,
            page: 1,
        };

        const columns = [
            {
                name: 'id',
                align: 'left',
                label: '#',
                field: 'id',
                sortable: true,
            },
            {
                name: 'name',
                align: 'left',
                label: tm.t('name'),
                field: 'name',
                sortable: true,
            },
            {
                name: 'failedReason',
                align: 'left',
                label: tm.t('failedReason'),
                field: 'failedReason',
                sortable: true,
            },
            {
                name: 'queue',
                align: 'left',
                label: tm.t('queue'),
                field: 'queueName',
                sortable: true,
            },
            {
                name: 'status',
                align: 'left',
                label: tm.t('status'),
                field: 'status',
                sortable: true,
            },
            {
                name: 'date',
                align: 'left',
                label: tm.t('date'),
                field: 'date',
                format: (value: string) => tm.d(value, 'long'),
                sortable: true,
            },
            {
                name: 'actions',
                align: 'right',
            },
        ];

        async function setJobs() {
            loading.value = true;

            rows.value = await fetchJobs();

            setTimeout(() => (loading.value = false), 800);
        }

        void setJobs();

        useIntervalFn(() => {
            void setJobs();
        }, 5000);

        function getColor(value: string) {
            if (value === 'waiting') {
                return 'warning';
            }

            if (value === 'completed') {
                return 'success';
            }

            if (value === 'failed') {
                return 'negative';
            }
        }

        function deleteSelected() {
            quasar
                .dialog({
                    title: tm.t('areYouSure'),
                    message: tm.t('thisActionCanNotBeUndone'),
                    cancel: true,
                })
                .onOk(async () => {
                    await updateJobs(
                        'delete',
                        selected.value.filter((j) => j.status !== 'active'),
                    );

                    selected.value = [];

                    await setJobs();
                });
        }

        function deleteSingle(row: Job) {
            selected.value = [row];
            deleteSelected();
        }

        function onSelection({ rows }: any) {
            selected.value = rows.filter((s: Job) => s.status !== 'active');
        }

        return {
            rows,
            columns,
            loading,
            selected,
            initialPagination,

            onSelection,
            getColor,
            deleteSelected,
            deleteSingle,
        };
    },
});
</script>
