<template>
    <q-page padding class="row items-stretch">
        <div class="col full-width">
            <q-card class="full-height flex column items-start">
                <q-tabs v-model="tab" inline-label>
                    <q-tab
                        v-for="section in sections"
                        :key="section.name"
                        :name="section.name"
                        :icon="section.icon"
                        :label="section.label"
                    />
                </q-tabs>

                <q-separator class="full-width" />

                <q-tab-panels
                    v-model="tab"
                    class="full-width"
                    animated
                    swipeable
                    style="height: calc(100% - 49px)"
                >
                    <q-tab-panel
                        v-for="section in sections"
                        :key="section.name"
                        :name="section.name"
                        class="q-pa-none"
                    >
                        <component
                            :is="section.component"
                            :origin-id="originId"
                        />
                    </q-tab-panel>
                </q-tab-panels>
            </q-card>
        </div>
    </q-page>
</template>

<script lang="ts">
import { defineComponent, ref, defineAsyncComponent, watch } from 'vue';
import { useI18n } from 'vue-i18n';
import { useRouter, useRoute } from 'vue-router';

export default defineComponent({
    name: 'OriginSingle',
    props: {
        originId: {
            type: [Number, String],
            default: null,
        },
    },
    setup() {
        const tm = useI18n();
        const route = useRoute();
        const router = useRouter();

        const tab = ref(route.query.tab || 'general');

        const sections = [
            {
                label: tm.t('general'),
                name: 'general',
                icon: 'home',
                component: defineAsyncComponent(() => import('./General.vue')),
            },
            {
                label: tm.t('provider', 2),
                name: 'providers',
                icon: 'list',
                component: defineAsyncComponent(
                    () => import('./ProviderList.vue'),
                ),
            },
        ];

        watch(
            () => tab.value,
            (value) => router.push({ query: { tab: value } }),
        );

        return {
            origin,
            tab,
            sections,
        };
    },
});
</script>
