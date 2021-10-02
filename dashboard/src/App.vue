<template>
    <router-view />
</template>
<script lang="ts">
import { defineComponent, watch } from 'vue';
import { useStore } from 'src/store';
import { name, version } from '../../package.json';
import { useRouter } from 'vue-router';
import { capitalize } from 'lodash';
import { setInjects } from './boot/space';

export default defineComponent({
    name: 'App',
    setup() {
        const store = useStore();
        const router = useRouter();

        store.commit('app/setName', capitalize(name).replace('-', ' '));

        store.commit('app/setVersion', version);

        setInjects();

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
