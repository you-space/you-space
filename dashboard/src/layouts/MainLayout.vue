<template>
    <q-layout view="hHh Lpr fFf">
        <app-header v-model:drawer="drawer" />

        <q-drawer v-model="drawer" show-if-above bordered>
            <q-inner-loading :showing="loading"> </q-inner-loading>
            <q-list class="text-blue-grey-5">
                <template v-for="(item, index) in menuList" :key="index">
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
import { api } from 'src/boot/axios';
import { useEvents } from 'src/boot/events';
import { defineComponent, ref, defineAsyncComponent } from 'vue';
import { useI18n } from 'vue-i18n';

interface ServerMenu {
    name: string;
    label: string;
    icon?: string;
    typeId: number;
}

export default defineComponent({
    name: 'MainLayout',
    components: {
        AppHeader: defineAsyncComponent(
            () => import('src/components/AppHeader.vue'),
        ),
    },
    setup() {
        const tm = useI18n();
        const events = useEvents();

        const drawer = ref(false);
        const loading = ref(false);
        const menuList = ref<any[]>([]);

        async function setMenus() {
            loading.value = true;
            menuList.value = [];

            const { data: menus } = await api.get<ServerMenu[]>(
                'admin/dashboard/menus',
            );

            if (menus.length) {
                menuList.value.push({
                    label: tm.t('content', 2),
                    header: true,
                });
            }

            menus.forEach((menu) => {
                menuList.value.push({
                    label: menu.label,
                    icon: menu.icon || 'list',
                    to: {
                        name: 'type-items',
                        params: { typeId: menu.typeId },
                    },
                });
            });

            menuList.value.push(
                {
                    label: tm.t('general', 2),
                    header: true,
                },
                {
                    label: tm.t('origin', 2),
                    icon: 'view_in_ar',
                    to: { name: 'origins' },
                },

                {
                    label: tm.t('theme', 2),
                    icon: 'color_lens',
                    to: { name: 'themes' },
                },
                {
                    label: tm.t('plugin', 2),
                    icon: 'casino',
                    to: { name: 'plugins' },
                },
                {
                    label: tm.t('advanced'),
                    header: true,
                },
                {
                    label: tm.t('item', 2),
                    icon: 'list_alt',
                    to: { name: 'items-all', params: {} },
                },
                {
                    label: tm.t('type', 2),
                    icon: 'title',
                    to: { name: 'types' },
                },
                {
                    label: tm.t('job', 2),
                    icon: 'casino',
                    to: { name: 'jobs' },
                },
            );

            setTimeout(() => (loading.value = false), 800);
        }

        void setMenus();
        events.subscribe('menu:update', () => void setMenus());

        return {
            menuList,
            loading,
            drawer,
        };
    },
});
</script>
