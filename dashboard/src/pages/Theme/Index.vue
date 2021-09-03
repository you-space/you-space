<template>
    <q-page padding>
        <ys-table :rows="themes" :columns="columns" selection="single">
            <template #body-selection="props">
                <q-toggle
                    :model-value="props.row.active"
                    @update:model-value="setActiveTheme(props.row)"
                />
            </template>

            <template #body-cell-scripts="props">
                <q-td :props="props">
                    <q-btn
                        v-for="script in props.value"
                        :key="script"
                        :label="script"
                        color="primary"
                        @click="executeThemeScript(props.row, script)"
                    />
                </q-td>
            </template>
        </ys-table>
    </q-page>
</template>
<script lang="ts">
import { useQuasar } from 'quasar';
import { defineComponent, ref } from 'vue';
import { useI18n } from 'vue-i18n';

import { api } from 'src/boot/axios';
import { executeScript } from './compositions';

interface SiteTheme {
    name: string;
}

export default defineComponent({
    setup() {
        const tm = useI18n();
        const quasar = useQuasar();

        const themes = ref<SiteTheme[]>([]);

        const columns = [
            {
                name: 'Name',
                field: 'name',
                label: tm.t('name'),
                align: 'left',
            },
            { name: 'scripts', field: 'scripts' },
        ];

        async function setThemes() {
            const { data } = await api.get<SiteTheme[]>('admin/themes');

            themes.value = data;
        }

        void setThemes();

        async function setActiveTheme(theme: SiteTheme) {
            await api.post('admin/themes/set-theme', { name: theme.name });

            await setThemes();
        }

        function executeThemeScript(theme: SiteTheme, scriptName: string) {
            quasar
                .dialog({
                    title: tm.t('areYouSure'),
                    cancel: true,
                })
                .onOk(async () => {
                    await executeScript(theme.name, [scriptName]);
                });
        }

        return {
            themes,
            setActiveTheme,
            executeThemeScript,
            columns,
        };
    },
});
</script>
