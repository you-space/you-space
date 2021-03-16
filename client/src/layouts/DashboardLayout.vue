<template>
  <q-layout view="hHh Lpr lFf">
    <q-header elevated>
      <q-toolbar>
        <q-btn
          flat
          dense
          round
          icon="menu"
          aria-label="Menu"
          @click="toggleLeftDrawer"
        />

        <q-toolbar-title>
          You space
          <q-btn
            color="white"
            text-color="black"
            size="sm"
            class="q-ml-md"
            :to="{ name: 'home' }"
          >
            {{ $t('viewChannel') }}
          </q-btn>
        </q-toolbar-title>
      </q-toolbar>
    </q-header>

    <q-drawer
      v-model="leftDrawerOpen"
      show-if-above
      bordered
      class="bg-grey-1"
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
            </q-item-section>
          </q-item>
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
import lodash from 'lodash';

export default defineComponent({
    name: 'MainLayout',

    preFetch(options){
        const store = options.store;
        const redirect = options.redirect as any;
        const isAuthenticaed = lodash.get(store, 'state.user.authenticated', false);

        if (isAuthenticaed) {
            return;
        }
        redirect({
            name: 'login'
        });
    },

    setup () {
        const tm = useI18n();

        const leftDrawerOpen = ref(false);
        const menuList = [
            {
                label: tm.t('dashboard'),
                icon: 'home',
                to: {
                    name: 'admin' 
                },
            },
            {
                label: tm.t('videoList'),
                icon: 'list',
                to: {
                    name: 'admin-videos' 
                },
            },
            {
                label: tm.t('origins'),
                icon: 'list',
                to: {
                    name: 'admin-origins' 
                },
            },
        ];

        return {
            menuList,
            leftDrawerOpen,
            toggleLeftDrawer () {
                leftDrawerOpen.value = !leftDrawerOpen.value;
            }
        };
    }
});
</script>
