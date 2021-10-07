<template>
    <q-layout view="hHh Lpr fFf">
        <app-header v-model:drawer="drawer" />

        <q-drawer v-model="drawer" show-if-above bordered>
            <q-inner-loading :showing="loading"> </q-inner-loading>
            <q-list class="text-blue-grey-5">
                <template
                    v-for="(item, index) in Array.from(links.values())"
                    :key="index"
                >
                    <template v-if="item.header">
                        <q-separator v-if="index > 1" spaced />
                        <q-item-label header>
                            {{ item.label }}
                        </q-item-label>
                    </template>

                    <q-item
                        v-else
                        v-ripple
                        exact
                        active-class="text-blue-grey-5 bg-blue-grey-1"
                        :to="item.to"
                    >
                        <q-item-section avatar>
                            <q-icon :name="item.icon" />
                        </q-item-section>
                        <q-item-section>
                            {{ item.label }}
                        </q-item-section>
                    </q-item>
                </template>
            </q-list>
        </q-drawer>

        <q-page-container class="bg-grey-1">
            <router-view />
        </q-page-container>

        <q-footer bordered class="bg-white text-grey-8 q-pa-sm text-right">
            <div class="text-caption">
                {{ $store.state.app.version }}
            </div>
        </q-footer>
    </q-layout>
</template>

<script lang="ts">
import { defineComponent, ref, defineAsyncComponent } from 'vue';
import { useI18n } from 'vue-i18n';
import { fetchPages } from './compositions';
import { debounce } from 'lodash';
import { useSpace } from 'src/boot/space';

export default defineComponent({
    name: 'MainLayout',
    components: {
        AppHeader: defineAsyncComponent(() => import('./Header.vue')),
    },
    setup() {
        const tm = useI18n();
        const space = useSpace();

        const drawer = ref(false);
        const loading = ref(false);
        const links = ref(new Map());

        function setDefaultLinks() {
            links.value.set('general', {
                label: tm.t('general', 2),
                header: true,
            });

            // links.value.set('origin', {
            //     label: tm.t('origin', 2),
            //     icon: 'view_in_ar',
            //     to: { name: 'origins' },
            // });

            links.value.set('theme', {
                label: tm.t('theme', 2),
                icon: 'color_lens',
                to: { name: 'themes' },
            });

            links.value.set('plugin', {
                label: tm.t('plugin', 2),
                icon: 'casino',
                to: { name: 'plugins' },
            });

            links.value.set('configurations', {
                label: tm.t('configurations', 2),
                icon: 'settings',
                to: { name: 'configurations' },
            });
        }

        async function setServerLinks() {
            const pages = await fetchPages();

            pages.forEach((page) => {
                links.value.set(page.name, {
                    label: page.label || page.name,
                    icon: page.icon || 'list',
                    to: {
                        name: 'server-page',
                        params: {
                            name: page.name,
                        },
                    },
                });
            });
        }

        const load = debounce(async () => {
            loading.value = true;

            links.value.clear();

            setDefaultLinks();

            await setServerLinks().catch(console.error);

            setTimeout(() => (loading.value = false), 800);
        });

        function subscribe() {
            space.on('meta:pages:*:created', load);
            space.on('meta:pages:*:updated', load);
            space.on('meta:pages:*:deleted', load);
        }

        void load();

        void subscribe();

        return {
            links,
            loading,
            drawer,
        };
    },
});
</script>
