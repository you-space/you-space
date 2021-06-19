<template>
    <router-view />
</template>
<script lang="ts">
import { defineComponent, watch } from 'vue';
import { useStore } from 'src/store';
import packageJSON from '../../package.json';
import { useRouter } from 'vue-router';

export default defineComponent({
    name: 'App',
    setup() {
        const store = useStore();
        const router = useRouter();

        store.commit('app/setVersion', packageJSON.version);

        watch(
            () => store.state.auth.isAuthenticated,
            async (value) => {
                if (!value) {
                    await router.push({ name: 'login' });
                }
            },
            { immediate: true },
        );

        return {};
    },
});
</script>
