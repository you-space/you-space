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
                        icon="visibility"
                        size="sm"
                        flat
                        round
                        :to="getOriginPath(props.row.id)"
                    />
                    <template v-if="!props.row.isDefault">
                        <q-btn
                            icon="delete"
                            size="sm"
                            flat
                            round
                            @click="deleteOrigin(props.row.id)"
                        />
                    </template>
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
import { defineComponent, ref, defineAsyncComponent } from 'vue';
import { useI18n } from 'vue-i18n';
import { api } from 'boot/axios';
import { Origin } from 'src/types';

export default defineComponent({
    components: {
        OriginListDialog: defineAsyncComponent(
            () => import('./OriginListDialog.vue'),
        ),
    },
    setup() {
        const tm = useI18n();

        const rows = ref<Origin[]>([]);
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
            { name: 'actions' },
        ];

        const setOrigins = async () => {
            const { data } = await api.get('/admin/origins');
            rows.value = data;
        };

        const getOriginPath = (id: number) => {
            return {
                name: 'origin-single',
                params: { originId: id },
            };
        };

        const deleteOrigin = async (id: number) => {
            await api.delete(`/admin/origins/${id}`);
            await setOrigins();
        };

        async function importOriginVideos(id: number) {
            await api.post(`/admin/origins/import/${id}`);
            await setOrigins();
        }

        void setOrigins();

        return {
            rows,
            columns,
            dialog,
            deleteOrigin,
            setOrigins,
            getOriginPath,
            editedItemid,
            importOriginVideos,
        };
    },
});
</script>
