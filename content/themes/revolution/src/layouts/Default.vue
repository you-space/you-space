<template>
  <r-layout>
    <template #header>
      <r-header class="bg-white flex items-center">
        <r-btn class="mr-4" @click="toggleLeftDrawer" icon="bars" />
        <h1>You space</h1>
      </r-header>
    </template>

    <template #drawer>
      <r-drawer v-model="leftDrawerOpen">
        <r-list class="text-blue-grey-500">
          <template v-for="(item, index) in menuList" :key="index">
            <r-item clickable :to="item.to">
              <r-item-section side>
                <f-icon :icon="item.icon" />
              </r-item-section>
              <r-item-section class="ml-4">
                {{ item.label }}
              </r-item-section>
            </r-item>
          </template>
        </r-list>
      </r-drawer>
    </template>

    <r-container class="bg-gray-100 h-full">
      <router-view />
    </r-container>
  </r-layout>
</template>

<script lang="ts">
import { defineComponent, ref } from 'vue'
import { useI18n } from 'vue-i18n'
export default defineComponent({
  name: 'Default',
  setup() {
    const tm = useI18n()

    const leftDrawerOpen = ref(true)
    const menuList = [
      {
        label: tm.t('home'),
        icon: 'home',
        to: { name: 'home' },
      },
      {
        label: tm.t('latestVideos'),
        icon: ['fab', 'telegram-plane'],
        // to: { name: '404' },
      },
      {
        label: tm.t('recommendations'),
        icon: 'play-circle',
        // to: { name: '404' },
      },
      {
        label: tm.t('favorites'),
        icon: 'heart',
        // to: { name: '404' },
      },
      {
        label: tm.t('history'),
        icon: 'history',
        // to: { name: '404' },
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
