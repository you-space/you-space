<template>
    <q-page padding>
        <ys-table
            v-model:pagination="pagination"
            :rows="origins"
            :columns="columns"
            :title="$tc('origin', 2)"
            @request="reload"
        >
            <template #top-right>
                <q-btn
                    :label="$t('add', [$t('origin')])"
                    color="primary"
                    @click="addNew"
                />
            </template>

            <template #body-cell-active="props">
                <q-td :props="props">
                    <q-toggle
                        :model-value="props.value"
                        @update:model-value="toggleStatus(props.row)"
                    />
                </q-td>
            </template>

            <template #body-cell-valid="props">
                <q-td :props="props">
                    <q-icon
                        :name="props.value ? 'check' : 'close'"
                        :color="props.value ? 'positive' : 'negative'"
                    />
                </q-td>
            </template>

            <template #body-cell-actions="props">
                <q-td :props="props">
                    <q-btn
                        icon="edit"
                        round
                        color="grey-7"
                        flat
                        size="sm"
                        @click="showOrigin(props.row)"
                    />
                    <q-btn
                        icon="delete"
                        round
                        color="grey-7"
                        flat
                        size="sm"
                        @click="deleteOrigin(props.row)"
                    />
                </q-td>
            </template>
        </ys-table>
    </q-page>
</template>
<script lang="ts">
import { defineComponent, ref, defineAsyncComponent } from 'vue';
import { useQuasar } from 'quasar';
import { useI18n } from 'vue-i18n';
import { useRouter } from 'vue-router';

import { api } from 'src/boot/axios';
import {
    deleteOriginById,
    fetchOrigins,
    Origin,
} from 'src/pages/Origins/composition';
import { createServerPagination } from 'src/components/compositions';

export default defineComponent({
    name: 'Origins',
    setup() {
        const tm = useI18n();
        const quasar = useQuasar();
        const router = useRouter();

        const origins = ref<Origin[]>([]);
        const columns = [
            {
                name: 'active',
                field: 'active',
                align: 'left',
                label: tm.t('active'),
                style: {
                    width: '30px',
                },
            },
            {
                name: 'name',
                field: 'name',
                align: 'left',
                label: tm.t('name'),
            },

            {
                name: 'valid',
                field: 'valid',
                align: 'left',
                label: tm.t('valid'),
            },

            {
                name: 'providerName',
                field: 'providerName',
                align: 'left',
                label: tm.t('provider'),
            },

            {
                name: 'actions',
            },
        ];

        const { pagination, reload } = createServerPagination(
            fetchOrigins,
            ({ data }) => {
                origins.value = data;
            },
        );

        async function load() {
            await reload({ pagination: pagination.value });
        }

        void load();

        function addNew() {
            quasar
                .dialog({
                    title: tm.t('addNew'),
                    component: defineAsyncComponent(
                        () => import('./Dialog.vue'),
                    ),
                })
                .onOk(async (data: { name: string; providerName: string }) => {
                    await api.post(`admin/origins`, {
                        name: data.name,
                        providerName: data.providerName,
                    });

                    await load();
                });
        }

        async function toggleStatus(origin: Origin) {
            await api
                .patch(`admin/origins/${origin.id}`, { active: !origin.active })
                .catch(console.error);

            await load();
        }

        function showOrigin(origin: Origin) {
            return router.push({
                name: 'origins-single',
                params: {
                    id: origin.id,
                },
            });
        }

        function deleteOrigin(origin: Origin) {
            quasar
                .dialog({
                    title: tm.t('areYouSure'),
                    message: tm.t('thisActionCanNotBeUndone'),
                    cancel: true,
                })
                .onOk(async () => {
                    await deleteOriginById(origin.id);
                    await load();
                });
        }

        return {
            origins,
            columns,
            pagination,

            showOrigin,
            reload,
            addNew,
            toggleStatus,
            deleteOrigin,
        };
    },
});
</script>
