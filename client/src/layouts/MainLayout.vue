<template>
  <q-layout view="hHh Lpr lFf">
    <q-header
      bordered
      class="bg-white text-primary"
    >
      <q-toolbar>
        <q-btn
          flat
          dense
          round
          icon="menu"
          aria-label="Menu"
          @click="toggleDrawer"
        />
        <q-toolbar-title>
          Channel
          <q-btn
            color="white"
            text-color="black"
            size="sm"
            class="q-ml-md"
            :to="{ name: 'admin' }"
          >
            {{ $t('viewAdminDashboard') }}
          </q-btn>
        </q-toolbar-title>
      </q-toolbar>
    </q-header>

    <q-drawer
      v-model="drawer"
      show-if-above
      bordered
    >
      <q-list>
        <template
          v-for="(item, index) in menuList"
          :key="index"
        >
          <q-item
            v-ripple 
            exact
            :active="item.label === 'Outbox'"
            :to="item.to"            
          >
            <q-item-section avatar>
              <q-icon :name="item.icon" />
            </q-item-section>
            <q-item-section>
              {{ item.label }}
              <template v-if="!item.to">
                - not created
              </template>
            </q-item-section>
          </q-item>


          <q-separator
            v-if="item.separator"
            :key="`${index}-separator`"
          />
        </template>
      </q-list>
    </q-drawer>

    <q-page-container>
      <router-view />
    </q-page-container>
  </q-layout>
</template>

<script lang="ts">
import { defineComponent, ref } from 'vue';
import { useI18n } from 'vue-i18n';

export default defineComponent({
    name: 'MainLayout',
    setup () {
        const tm = useI18n();

        const drawer = ref(false);
        const menuList = [
            {
                label: tm.t('home'),
                to: {
                    name: 'home'
                },
                icon: 'home'
            },
            // {
            //     label: tm.t('favorites'),
            //     icon: 'favorite',
            // },
            // {
            //     label: tm.t('plalists'),
            //     icon: 'list',
            //     separator: true
            // },
            // {
            //     label: tm.t('myChanel'),
            //     icon: 'list',
            //     to: {
            //         name: 'admin'
            //     }
            
            // },
            // {
            //     label: tm.t('history'),
            //     icon: 'history',
            // },
        ];

        return {
            menuList,
            drawer,
            toggleDrawer () {
                drawer.value = !drawer.value;
            }
        };
    }
});
</script>
