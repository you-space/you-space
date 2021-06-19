<template>
    <q-page padding>
        <div class="row">
            <div class="col-12 q-pa-sm text-right">
                <q-btn color="primary" @click="dialog = true">{{
                    $t('addNew')
                }}</q-btn>
            </div>
            <div
                v-for="(plugin, index) in plugins"
                :key="index"
                class="col-12 q-pa-sm"
            >
                <q-card class="plugin-card">
                    <div class="row items-stretch full-height full-width">
                        <div
                            class="col-1 bg-grey-7 row items-center justify-center"
                        >
                            <q-icon name="extension" color="grey-2" size="lg" />
                        </div>
                        <div class="col q-px-md row">
                            <div class="col-12">
                                <h2 class="text-h6">{{ plugin.name }}</h2>
                                <p v-if="plugin.description" class="q-ma-none">
                                    {{ plugin.description }}
                                </p>
                            </div>
                            <div class="col-12 self-end text-right q-py-md">
                                <q-btn
                                    v-if="plugin.active"
                                    :label="$t('deactivate')"
                                    color="negative"
                                    @click="toggleActivePlugin(plugin, false)"
                                />

                                <template v-else>
                                    <q-btn
                                        :label="$t('delete')"
                                        color="negative"
                                        class="q-mr-sm"
                                        @click="deletePlugin(plugin)"
                                    />
                                    <q-btn
                                        :label="$t('activate')"
                                        color="positive"
                                        @click="
                                            toggleActivePlugin(plugin, true)
                                        "
                                    />
                                </template>
                            </div>
                        </div>
                    </div>
                </q-card>
            </div>
            <q-dialog v-model="dialog">
                <q-card style="width: 100%; max-width: 500px">
                    <q-card-section>
                        <div class="text-h6 q-mb-md">
                            {{ $t('addNew') }}
                        </div>
                        <q-input
                            v-model="githubUrl"
                            filled
                            :label="$t('githubUrl')"
                        />
                    </q-card-section>
                    <q-card-actions align="right">
                        <q-btn
                            color="primary"
                            flat
                            :label="$t('cancel')"
                            @click="dialog = false"
                        />
                        <q-btn
                            color="primary"
                            :loading="loading"
                            :label="$t('save')"
                            @click="addPlugin"
                        />
                    </q-card-actions>
                </q-card>
            </q-dialog>
        </div>
    </q-page>
</template>
<script lang="ts">
import { api } from 'src/boot/axios';
import { useQuasar } from 'quasar';
import { defineComponent, ref } from 'vue';
import { useI18n } from 'vue-i18n';
import { useEvents } from 'src/boot/events';

interface Plugin {
    name: string;
}

export default defineComponent({
    setup() {
        const quasar = useQuasar();
        const tm = useI18n();
        const events = useEvents();

        const plugins = ref<Plugin[]>([]);
        const dialog = ref(false);
        const githubUrl = ref('');
        const loading = ref(false);

        async function setPlugins() {
            const request = await api.get<Plugin[]>('admin/plugins');
            plugins.value = request.data;
        }

        void setPlugins();

        async function addPlugin() {
            try {
                loading.value = true;
                await api.post('admin/plugins', { githubUrl: githubUrl.value });
                await setPlugins();

                setTimeout(() => {
                    loading.value = false;
                    dialog.value = false;
                }, 800);
            } catch (error) {
                loading.value = false;
            }
        }

        async function toggleActivePlugin(plugin: Plugin, value: boolean) {
            try {
                const data = { name: plugin.name };

                if (value) {
                    await api.post('admin/plugins/start', data);
                } else {
                    await api.post('admin/plugins/stop', data);
                }

                await setPlugins();

                events.notifyAll('plugins:update');
            } catch (error) {
                await setPlugins();
            }
        }

        function deletePlugin(plugin: Plugin) {
            quasar.dialog({ title: tm.t('areYouSure') }).onOk(async () => {
                await api.delete(`admin/plugins/${plugin.name}`);
                await setPlugins();
            });
        }

        const state = {
            plugins,
            dialog,
            githubUrl,
            loading,

            addPlugin,
            toggleActivePlugin,
            deletePlugin,
        };

        return state;
    },
});
</script>

<style lang="scss">
.plugin-card {
}
</style>
