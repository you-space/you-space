<template>
    <router-view />
</template>
<script lang="ts">
import { defineComponent } from 'vue';
import { useStore } from 'src/store';
import { useStore as vuexUseStore } from 'vuex';
import packageJSON from '../../package.json';

export default defineComponent({
    name: 'App',
    setup() {
        const store = useStore();
        store.commit('app/setVersion', packageJSON.version);
        return {};
    },
});
</script>
