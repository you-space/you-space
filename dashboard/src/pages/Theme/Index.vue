<template>
    <q-page padding>
        <ys-table
            :rows="themes"
            :columns="columns"
            selection="single"
            :title="$tc('theme', 2)"
        >
            <template #top-right>
                <q-btn
                    :label="$t('add', [$t('theme')])"
                    color="primary"
                    @click="addNew"
                />
            </template>
            <template #body-selection="props">
                <q-toggle
                    :model-value="props.row.active"
                    @update:model-value="updateTheme(props.row)"
                />
            </template>

            <template #body-cell-scripts="props">
                <q-td :props="props">
                    <q-btn
                        v-for="script in props.value"
                        :key="script"
                        :label="script"
                        color="primary"
                        class="q-mr-md"
                        @click="executeThemeScript(props.row, script)"
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
                        @click="deleteTheme(props.row)"
                    />
                </q-td>
            </template>
        </ys-table>
    </q-page>
</template>
<script lang="ts">
import { useQuasar } from 'quasar';
import { defineComponent, defineAsyncComponent, ref } from 'vue';
import { useI18n } from 'vue-i18n';

import { api } from 'src/boot/axios';
import { deleteThemeByName, executeScript } from './compositions';

interface SiteTheme {
    name: string;
    active: boolean;
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
            { name: 'actions', style: 'width:50px' },
        ];

        async function setThemes() {
            const { data } = await api.get<SiteTheme[]>('admin/themes');

            themes.value = data;
        }

        void setThemes();

        async function updateTheme(theme: SiteTheme) {
            await api.patch(`admin/themes/${theme.name}`, {
                active: !theme.active,
            });

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

        function addNew() {
            quasar
                .dialog({
                    component: defineAsyncComponent(
                        () => import('./Dialog.vue'),
                    ),
                })
                .onOk(setThemes);
        }

        function deleteTheme(theme: SiteTheme) {
            quasar
                .dialog({
                    title: tm.t('areYouSure'),
                    cancel: true,
                })
                .onOk(async () => {
                    await deleteThemeByName(theme.name);
                    await setThemes();
                });
        }

        return {
            themes,
            columns,

            addNew,
            updateTheme,
            executeThemeScript,
            deleteTheme,
        };
    },
});
</script>
