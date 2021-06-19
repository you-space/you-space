<template>
    <q-header bordered class="bg-white text-grey-5">
        <q-toolbar>
            <q-btn
                v-if="drawer !== null"
                flat
                dense
                round
                icon="menu"
                aria-label="Menu"
                @click="toggleDrawer"
            />

            <q-toolbar-title> {{ $store.state.app.name }} </q-toolbar-title>

            <q-btn round color="white" class="q-ml-md" size="sm">
                <q-avatar size="28px">
                    <q-icon color="grey" name="person"></q-icon>
                </q-avatar>
                <q-menu :offset="[0, 10]">
                    <q-card style="min-width: 300px">
                        <q-item>
                            <q-item-section avatar>
                                <q-avatar>
                                    <q-icon color="grey" name="person"></q-icon>
                                </q-avatar>
                            </q-item-section>
                            <q-item-section v-if="$store.state.auth.user">
                                <q-item-label>
                                    {{ $store.state.auth.user.name }}
                                </q-item-label>
                                <q-item-label caption>
                                    {{ $store.state.auth.user.username }}
                                </q-item-label>
                            </q-item-section>
                        </q-item>

                        <q-separator />

                        <q-card-actions>
                            <q-btn
                                :label="$t('logout')"
                                icon="exit_to_app"
                                color="negative"
                                @click="logout"
                            />
                        </q-card-actions>
                    </q-card>
                </q-menu>
            </q-btn>
        </q-toolbar>
    </q-header>
</template>

<script lang="ts">
import { useStore } from 'src/store';
import { defineComponent } from 'vue';

export default defineComponent({
    name: 'AppHeader',
    props: {
        drawer: {
            type: Boolean,
            default: null,
        },
    },
    emits: ['update:drawer'],
    setup(props, { emit }) {
        const store = useStore();

        function toggleDrawer() {
            emit('update:drawer', !props.drawer);
        }

        async function logout() {
            await store.dispatch('auth/logout');
        }

        return {
            toggleDrawer,
            logout,
        };
    },
});
</script>
