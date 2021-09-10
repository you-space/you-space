<template>
    <q-page padding>
        <ys-table :rows="plugins" :columns="columns" :title="$tc('plugin', 2)">
            <template #top-right>
                <q-btn
                    :label="$t('add', [$t('plugin')])"
                    color="primary"
                    @click="addNew"
                />
            </template>

            <template #body-cell-active="props">
                <q-td :props="props">
                    <q-toggle
                        :model-value="props.value"
                        @click="toggleActivePlugin(props.row, !props.value)"
                    />
                </q-td>
            </template>

            <template #body-cell-actions="props">
                <q-td :props="props">
                    <q-btn
                        icon="delete"
                        flat
                        round
                        size="sm"
                        color="grey-5"
                        @click="deletePlugin(props.row)"
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

import { useEvents } from 'src/boot/events';

import {
    Plugin,
    fetchPlugins,
    updatePlugin,
    deletePluginByName,
} from './compositions';

export default defineComponent({
    setup() {
        const quasar = useQuasar();
        const tm = useI18n();
        const events = useEvents();

        const dialog = ref(false);
        const githubUrl = ref('');
        const loading = ref(false);

        const plugins = ref<Plugin[]>([]);

        const columns = [
            {
                name: 'active',
                label: tm.t('active'),
                field: 'active',
                align: 'left',
            },
            {
                name: 'name',
                label: tm.t('name'),
                field: 'name',
                align: 'left',
            },
            { name: 'actions' },
        ];

        async function setPlugins() {
            plugins.value = await fetchPlugins();
        }

        void setPlugins();

        function addNew() {
            quasar
                .dialog({
                    component: defineAsyncComponent(
                        () => import('./Dialog.vue'),
                    ),
                })
                .onOk(setPlugins);
        }

        async function toggleActivePlugin(plugin: Plugin, value: boolean) {
            await updatePlugin(plugin.name, value);

            await setPlugins();

            events.notifyAll('menu:update');
        }

        function deletePlugin(plugin: Plugin) {
            quasar.dialog({ title: tm.t('areYouSure') }).onOk(async () => {
                await deletePluginByName(plugin.name);

                await setPlugins();
            });
        }

        return {
            columns,
            plugins,
            dialog,
            githubUrl,
            loading,

            addNew,
            toggleActivePlugin,
            deletePlugin,
        };
    },
});
</script>

<style lang="scss">
.plugin-card {
}
</style>
