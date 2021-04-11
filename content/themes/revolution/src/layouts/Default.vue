<template>
  <q-layout view="hHh Lpr lFf">
    <q-header bordered class="bg-white text-blue-grey-5" height="30px">
      <q-toolbar>
        <q-btn flat dense round icon="menu" aria-label="Menu" @click="toggleLeftDrawer" />

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
              <template v-for="(child, childIndex) in item.children" :key="childIndex">
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
  </q-layout>
</template>

<script lang="ts">
import { defineComponent, ref } from 'vue'
// import { useI18n } from 'vue-i18n'
export default defineComponent({
  name: 'Default',
  setup() {
    // const tm = useI18n()

    const leftDrawerOpen = ref(false)
    const menuList = [
      {
        label: 'Home', //tm.t('home'),
        icon: 'home',
        to: { name: 'home' },
      },
    ]

    return {
      menuList,
      leftDrawerOpen,
      toggleLeftDrawer() {
        leftDrawerOpen.value = !leftDrawerOpen.value
      },
    }
  },
})
</script>
