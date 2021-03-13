<template>
  <q-page class="row items-start q-pa-lg">
    <q-table 
      class="full-width"
      :columns="columns"
      :rows="rows"
      :rows-per-page-options="[10, 20, 0]"
    >
      <template #top-right>
        <q-btn @click="dialog = true">
          {{ $t('addNew') }}
        </q-btn>
      </template>
     
      <template #body-cell-actions="props">
        <q-td :props="props">
          <q-icon
            name="delete"
            @click="deleteOrigin(props.row.id)"
          />
        </q-td>
      </template>
    </q-table>
    
    <admin-origin-list-dialog
      v-model="dialog"
      @save="setOrigins"
    />
  </q-page>
</template>

<script lang="ts">
import { defineComponent, ref, defineAsyncComponent, onMounted } from 'vue';
import { useI18n } from 'vue-i18n';

import { api  } from 'boot/axios';

export default defineComponent({
    components: {
        AdminOriginListDialog: defineAsyncComponent(() => import('./AdminOriginListDialog.vue'))
    },
    setup() {
        const tm = useI18n();
        
        const rows = ref<any[]>([]);
        const dialog = ref(false);

        const columns = [
            {
                label: tm.t('name'),
                name: 'name',
                field: 'name',
                align: 'left',
                style: 'width:100px'
            },
            {
                label: tm.t('type'),
                name: 'type',
                field: 'type',
                align: 'left'
            },
            {
                name: 'actions', 
            },
        ];

        const setOrigins = async () => {
            const {data } = await api.get('/admin/origins');
            rows.value = data;
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
            setOrigins
        };
    }
});
</script>
