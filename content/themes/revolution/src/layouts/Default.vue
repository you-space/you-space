<template>
  <r-layout>
    <template #header>
      <r-header class="bg-white">
        <r-btn @click="toggleLeftDrawer">
          <f-icon icon="bars"></f-icon>
        </r-btn>
        You space
      </r-header>
    </template>

    <template #drawer>
      <r-drawer v-model="leftDrawerOpen">
        <r-list class="text-blue-grey-500">
          <template v-for="(item, index) in menuList" :key="index">
            <r-item :to="item.to">
              <f-icon :icon="item.icon" />
              {{ item.label }}
            </r-item>
          </template>
        </r-list>
      </r-drawer>
    </template>

    <r-container class="bg-gray-100">
      <router-view />
    </r-container>
  </r-layout>
</template>

<script lang="ts">
import { defineComponent, ref } from 'vue'
// import { useI18n } from 'vue-i18n'
export default defineComponent({
  name: 'Default',
  setup() {
    // const tm = useI18n()

    const leftDrawerOpen = ref(true)
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
