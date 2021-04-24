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
import { defineComponent, ref, defineAsyncComponent } from 'vue';
import { useI18n } from 'vue-i18n';

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
        const tab = ref('general');

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

        return {
            origin,
            tab,
            sections,
        };
    },
});
</script>
