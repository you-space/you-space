<template>
    <q-page padding>
        <div class="row items-stretch">
            <div
                v-for="theme in themes"
                :key="theme.name"
                class="col-3 q-px-sm"
            >
                <q-card
                    class="q-pa-md full-height cursor-pointer"
                    :class="theme.isCurrent ? 'bg-primary text-white' : ''"
                    @click="setTheme(theme)"
                >
                    <h2 class="text-h6 text-bold q-my-sm">
                        {{ theme.displayName || theme.name }}
                    </h2>
                    <h3 v-if="theme.author" class="text-subtitle2 q-my-sm">
                        <span class="text-bold"> {{ $t('author') }}: </span>
                        {{ theme.author }}
                    </h3>
                    <h3 v-if="theme.description" class="text-body1 q-my-sm">
                        {{ theme.description }}
                    </h3>
                    <h4 v-if="theme.version" class="text-caption q-my-sm">
                        <span class="text-bold"> {{ $t('version') }}: </span>
                        {{ theme.version }}
                    </h4>
                </q-card>
            </div>
        </div>
    </q-page>
</template>
<script lang="ts">
import { api } from 'src/boot/axios';
import { defineComponent, ref } from 'vue';

export default defineComponent({
    setup() {
        const themes = ref<any>([]);

        async function setThemes() {
            const { data } = await api.get('admin/themes');

            themes.value = data;
        }

        async function setTheme(theme: any) {
            await api.post('admin/themes/set-theme', { name: theme.name });

            await setThemes();
        }

        void setThemes();

        return { themes, setTheme };
    },
});
</script>
