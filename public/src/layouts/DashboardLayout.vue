<template>
  <q-layout view="hHh Lpr lFf">
    <q-header
      bordered
      class="bg-white text-blue-grey-5"
      height="30px"
    >
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
            color="text-blue-grey-5"
            text-color="primary"
            size="sm"
            class="q-ml-md"
            :to="{ name: 'home' }"
            flat
            icon-right="chevron_right"
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
    >
      <q-list class="text-blue-grey-5">
        <template
          v-for="(item, index) in menuList"
          :key="index"
        >
          <q-item
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
  </q-layout>
</template>

<script lang="ts">
import { defineComponent, ref } from 'vue';
import { useI18n } from 'vue-i18n';
import lodash from 'lodash';

export default defineComponent({
    name: 'MainLayout',

    preFetch(options){
        // const store = options.store;
        // const redirect = options.redirect as any;
        // const isAuthenticaed = lodash.get(store, 'state.user.authenticated', false);

        // if (isAuthenticaed) {
        //     return;
        // }
        // redirect({
        //     name: 'login'
        // });
    },

    setup () {
        const tm = useI18n();

        const leftDrawerOpen = ref(false);
        const menuList = [
            {
                label: tm.t('dashboard'),
                icon: 'home',
                to: {
                    name: 'home'
                },
            },
            {
                label: tm.t('videoList'),
                icon: 'play_circle',
                to: {
                    name: 'videos' 
                },
            },
            {
                label: tm.t('origins'),
                icon: 'view_in_ar',
                to: {
                    name: 'origins' 
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
