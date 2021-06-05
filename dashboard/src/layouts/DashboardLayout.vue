<template>
    <q-layout view="hHh Lpr fFf">
        <q-header bordered class="bg-white text-blue-grey-5" height="30px">
            <q-toolbar>
                <q-btn
                    flat
                    dense
                    round
                    icon="menu"
                    aria-label="Menu"
                    @click="toggleLeftDrawer"
                />

                <q-toolbar-title> You space </q-toolbar-title>
            </q-toolbar>
        </q-header>

        <q-drawer v-model="leftDrawerOpen" show-if-above bordered>
            <q-list class="text-blue-grey-5">
                <template v-for="(item, index) in menuList" :key="index">
                    <q-item
                        v-if="!item.children"
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

                    <q-expansion-item
                        v-else
                        expand-separator
                        :icon="item.icon"
                        :label="item.label"
                        :to="item.to"
                        active-class="text-blue-grey-5 bg-blue-grey-1"
                    >
                        <q-list>
                            <template
                                v-for="(child, childIndex) in item.children"
                                :key="childIndex"
                            >
                                <q-item
                                    class="q-pl-md"
                                    exact
                                    active-class="text-blue-grey-5 text-bold"
                                    :to="child.to"
                                >
                                    <q-item-section avatar />
                                    <q-item-section>
                                        {{ child.label }}
                                    </q-item-section>
                                </q-item>
                            </template>
                        </q-list>
                    </q-expansion-item>
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
import { defineComponent, ref } from 'vue';
import { useI18n } from 'vue-i18n';

export default defineComponent({
    name: 'MainLayout',

    setup() {
        const tm = useI18n();

        const leftDrawerOpen = ref(false);
        const menuList = [
            // {
            //     label: tm.t('dashboard'),
            //     icon: 'home',
            //     to: { name: 'home' },
            // },
            // {
            //     label: tm.t('video', 2),
            //     icon: 'play_circle',
            //     to: { name: 'videos-list' },
            // },
            // {
            //     label: tm.t('visibility', 2),
            //     icon: 'visibility',
            //     to: { name: 'visibilities' },
            // },
            {
                label: tm.t('item', 2),
                icon: 'list',
                to: { name: 'items' },
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
                label: tm.t('origin', 2),
                icon: 'view_in_ar',
                to: { name: 'origins' },
            },
        ];

        return {
            menuList,
            leftDrawerOpen,
            toggleLeftDrawer() {
                leftDrawerOpen.value = !leftDrawerOpen.value;
            },
        };
    },
});
</script>
