<template>
  <q-layout view="lHh Lpr lFf">
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
        </q-toolbar-title>

        <div>Quasar v{{ $q.version }}</div>
      </q-toolbar>
    </q-header>

    <q-drawer
      v-model="leftDrawerOpen"
      show-if-above
      bordered
      class="bg-grey-1"
    >
      <q-list>
        <q-item-label
          header
          class="text-grey-8"
        >
          {{$t('page', 1)}}
        </q-item-label>

        

        <template v-for="(item, index) in menuList" :key="index">
          <q-item
            v-ripple 
            exact
            :active="item.label === 'Outbox'"
            :to='item.to'            
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
import { defineComponent, ref } from 'vue'
import { useI18n } from 'vue-i18n'

export default defineComponent({
    name: 'MainLayout',

    components: {},

    setup () {
        const tm = useI18n();

        const leftDrawerOpen = ref(false);
        const menuList = [
            {
                label: tm.t('home'),
                to: '/',
                icon: 'home'
            },
            {
                label: tm.t('videoList'),
                to: '/videos',
                icon: 'list'
            },
        ]

        return {
            menuList,
            leftDrawerOpen,
            toggleLeftDrawer () {
                leftDrawerOpen.value = !leftDrawerOpen.value
            }
        }
    }
})
</script>
