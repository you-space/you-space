<template>
    <q-page class="row items-start q-pa-lg">
        <q-table
            class="full-width"
            :columns="columns"
            :rows="rows"
            :rows-per-page-options="[10, 20, 0]"
        >
            <template #top-right>
                <q-btn
                    @click="
                        editedItemid = null;
                        dialog = true;
                    "
                >
                    {{ $t('addNew') }}
                </q-btn>
            </template>

            <template #body-cell-actions="props">
                <q-td :props="props">
                    <q-btn
                        icon="edit"
                        size="sm"
                        flat
                        round
                        @click="editOrigin(props.row.id)"
                    />
                    <q-btn
                        icon="delete"
                        size="sm"
                        flat
                        round
                        @click="deleteOrigin(props.row.id)"
                    />
                </q-td>
            </template>
        </q-table>

        <origin-list-dialog
            v-model="dialog"
            :origin-id="editedItemid"
            @save="setOrigins"
        />
    </q-page>
</template>

<script lang="ts">
import lodash from 'lodash';
import { defineComponent, ref, defineAsyncComponent, onMounted } from 'vue';
import { useI18n } from 'vue-i18n';

import { api } from 'boot/axios';

export default defineComponent({
    components: {
        OriginListDialog: defineAsyncComponent(
            () => import('./OriginListDialog.vue'),
        ),
    },
    setup() {
        const tm = useI18n();

        const rows = ref<any[]>([]);
        const dialog = ref(false);

        const editedItemid = ref<number | null>(null);

        const columns = [
            {
                label: tm.t('name'),
                name: 'name',
                field: 'name',
                align: 'left',
                style: 'width:100px',
            },
            {
                label: tm.t('type'),
                name: 'type',
                field: 'type',
                align: 'left',
            },
            {
                label: tm.t('totalVideos'),
                name: 'totalVideos',
                field: (row: any) => lodash.get(row, 'metadata.totalVideos', 0),
                align: 'left',
            },
            {
                label: tm.t('registeredVideos'),
                name: 'totalVideos',
                field: (row: any) =>
                    lodash.get(row, 'metadata.registeredVideos', 0),
                align: 'left',
            },
            { name: 'actions' },
        ];

        const setOrigins = async () => {
            const { data } = await api.get('/admin/origins');
            rows.value = data;
        };

        const editOrigin = (id: number) => {
            editedItemid.value = id;
            dialog.value = true;
        };

        const deleteOrigin = async (id: number) => {
            await api.delete(`/admin/origins/${id}`);
            await setOrigins();
        };

        onMounted(setOrigins);

        return {
            rows,
            columns,
            dialog,
            deleteOrigin,
            setOrigins,
            editOrigin,
            editedItemid,
        };
    },
});
</script>
