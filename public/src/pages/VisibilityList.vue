<template>
    <q-page padding>
        <q-table :rows="rows" :columns="columns">
            <template #top-right>
                <q-btn @click="addNew">
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
                        @click="editVisibility(props.row.id)"
                    />
                    <q-btn
                        icon="delete"
                        size="sm"
                        flat
                        round
                        @click="deleteVisibility(props.row.id)"
                    />
                </q-td>
            </template>
        </q-table>

        <visibility-dialog
            v-model="dialog"
            :visibility-id="editedItemid"
            @save="setRows"
        />
    </q-page>
</template>

<script lang="ts">
import { api } from 'src/boot/axios';
import { defineComponent, ref, defineAsyncComponent } from 'vue';
import { useI18n } from 'vue-i18n';
import { Visibility } from 'src/types';

export default defineComponent({
    name: 'VisibilityList',
    components: {
        VisibilityDialog: defineAsyncComponent(
            () => import('./VisibilityDialog.vue'),
        ),
    },
    setup() {
        const tm = useI18n();

        const rows = ref<Visibility[]>([]);
        const dialog = ref(false);
        const editedItemid = ref<number | null>(null);

        const columns = [
            {
                label: tm.t('name'),
                name: 'name',
                field: 'name',
                align: 'left',
            },
            {
                label: tm.t('permission', 2),
                name: 'permissions',
                field: ({ requiredPermissions }: Visibility) =>
                    requiredPermissions.map((p) => p.name).join(),
                align: 'left',
            },
            { name: 'actions' },
        ];

        async function setRows() {
            const { data } = await api.get<Visibility[]>('admin/visibilities');
            rows.value = data;
        }

        void setRows();

        function addNew() {
            editedItemid.value = null;
            dialog.value = true;
        }

        function editVisibility(id: number) {
            editedItemid.value = id;
            dialog.value = true;
        }

        async function deleteVisibility(id: number) {
            await api.delete(`admin/visibilities/${id}`);
            await setRows();
        }

        return {
            rows,
            setRows,
            columns,
            addNew,
            dialog,
            editVisibility,
            editedItemid,
            deleteVisibility,
        };
    },
});
</script>
