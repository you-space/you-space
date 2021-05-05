<template>
    <q-page padding>
        <div class="row items-stretch">
            <div class="col-12 q-pa-sm text-right">
                <q-btn @click="dialog = true">{{ $t('addNew') }}</q-btn>
            </div>

            <q-dialog v-model="dialog">
                <q-card style="min-width: 500px">
                    <q-card-section>
                        <div class="text-h6">{{ $t('newTheme') }}</div>
                    </q-card-section>
                    <q-card-section>
                        <q-select
                            v-model="githubUrl"
                            dense
                            use-input
                            new-value-mode="add-unique"
                            hide-dropdown-icon
                            :options="recommendedThemes"
                            :label="$t('githubUrl')"
                            @new-value="addValue"
                        />
                        <q-input v-model="branch" :label="$t('branch')" />
                    </q-card-section>
                    <q-card-actions align="right" class="text-primary">
                        <q-btn flat @click="addTheme">{{ $t('add') }}</q-btn>
                    </q-card-actions>
                </q-card>
            </q-dialog>

            <div
                v-for="theme in themes"
                :key="theme.name"
                class="col-3 q-px-sm"
            >
                <q-card class="full-height flex full-width">
                    <q-card-section
                        class="full-width"
                        :class="theme.isCurrent ? 'bg-primary text-white' : ''"
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
                            <span class="text-bold">
                                {{ $t('version') }}:
                            </span>
                            {{ theme.version }}
                        </h4>
                    </q-card-section>
                    <q-card-actions class="self-end text-left full-width">
                        <q-btn @click="setCurrentTheme(theme)">{{
                            $t('useTheme')
                        }}</q-btn>
                        <q-btn v-if="theme.build" @click="buildTheme(theme)">
                            {{ $t('buildTheme') }}
                        </q-btn>
                        <q-btn @click="deleteTheme(theme)">
                            {{ $t('deleteTheme') }}
                        </q-btn>
                    </q-card-actions>
                </q-card>
            </div>
        </div>
    </q-page>
</template>
<script lang="ts">
import { api } from 'src/boot/axios';
import { defineComponent, ref } from 'vue';

interface SiteTheme {
    name: string;
}

export default defineComponent({
    setup() {
        const themes = ref<SiteTheme[]>([]);
        const recommendedThemes = ref<string[]>([]);

        const githubUrl = ref('');
        const branch = ref('theme');
        const dialog = ref(false);

        async function setThemes() {
            const { data } = await api.get<SiteTheme[]>('admin/themes');

            themes.value = data;
        }

        void setThemes();

        async function setRecommendedThemes() {
            const { data } = await api.get('admin/themes/recommended-themes');

            recommendedThemes.value = data.map((t: any) => t.url);
            githubUrl.value = recommendedThemes.value[0];
        }

        void setRecommendedThemes();

        async function addTheme() {
            await api.post('admin/themes', {
                githubUrl: githubUrl.value,
                branch: branch.value,
            });

            await setThemes();

            dialog.value = false;
        }

        async function setCurrentTheme(theme: SiteTheme) {
            await api.post('admin/themes/set-theme', { name: theme.name });

            await setThemes();
        }

        async function buildTheme(theme: SiteTheme) {
            await api.post('admin/themes/build-theme', { name: theme.name });

            await setThemes();
        }

        async function deleteTheme(theme: SiteTheme) {
            await api.delete(`admin/themes/${String(theme.name)}`);

            await setThemes();
        }

        function addValue(
            value: string,
            done: (val: string, type: string) => void,
        ) {
            if (!recommendedThemes.value.includes(value)) {
                recommendedThemes.value.push(value);
                done(value, 'add');
            }
        }

        return {
            themes,
            githubUrl,
            dialog,
            branch,

            setCurrentTheme,
            buildTheme,
            deleteTheme,
            addTheme,
            recommendedThemes,
            addValue,
        };
    },
});
</script>
