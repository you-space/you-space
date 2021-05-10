<template>
    <q-page padding class="row items-stretch">
        <div class="col full-width">
            <q-card class="full-height flex column items-start">
                <div class="row full-width full-height">
                    <div class="col-3 border-r border-grey-4 relative">
                        <div
                            v-if="!origins.length"
                            class="absolute-center row column"
                        >
                            <span class="text-center q-mb-sm">
                                {{ $tc('noItem', 2) }}
                            </span>
                            <q-btn :label="$t('addNew')" @click="addNew" />
                        </div>

                        <q-list v-else separator>
                            <template
                                v-for="origin in origins"
                                :key="origin.id"
                            >
                                <q-item
                                    clickable
                                    :class="
                                        !origin.provider.exist ? 'bg-red-3' : ''
                                    "
                                    @click="selected = origin"
                                >
                                    <q-item-section>
                                        <q-item-label>
                                            {{ origin.name }}
                                            {{
                                                !origin.provider.exist
                                                    ? `(${$t('notFound')})`
                                                    : ''
                                            }}
                                        </q-item-label>
                                        <q-item-label caption>
                                            {{ origin.providerName }}
                                        </q-item-label>
                                    </q-item-section>
                                    <q-item-section avatar>
                                        <q-toggle
                                            v-model="origin.active"
                                            @update:model-value="
                                                toggleStatus(origin)
                                            "
                                        />
                                    </q-item-section>
                                </q-item>
                            </template>
                            <q-item clickable @click="addNew">
                                <q-item-section>
                                    <q-item-label>
                                        {{
                                            $t('add', [
                                                $t('origin').toLowerCase(),
                                            ])
                                        }}
                                    </q-item-label>
                                </q-item-section>
                                <q-item-section avatar>
                                    <q-icon name="add"></q-icon>
                                </q-item-section>
                            </q-item>
                        </q-list>
                    </div>

                    <div class="col-9 relative">
                        <template v-if="selected">
                            <q-tabs
                                v-model="tab"
                                inline-label
                                align="left"
                                style="height: 56px"
                            >
                                <q-tab
                                    v-for="option in tabOptions"
                                    :key="option.name"
                                    :name="option.name"
                                    :label="option.label"
                                />
                            </q-tabs>
                            <q-separator class="full-width" />

                            <q-tab-panels v-model="tab">
                                <q-tab-panel
                                    v-for="option in tabOptions"
                                    :key="option.name"
                                    :name="option.name"
                                >
                                    <component
                                        :is="option.component"
                                        :origin="selected"
                                        @reload="setOrigins"
                                    />
                                </q-tab-panel>
                            </q-tab-panels>
                        </template>

                        <div v-else class="absolute-center">
                            {{ $t('selectAItem') }}
                        </div>
                    </div>
                </div>
            </q-card>
        </div>
    </q-page>
</template>
<script lang="ts">
import { api } from 'src/boot/axios';
import { defineComponent, ref, defineAsyncComponent, watch } from 'vue';
import { useQuasar } from 'quasar';
import { useI18n } from 'vue-i18n';
import { Origin } from 'src/types';

export interface Provider {
    id: number;
    originId: number;
    name: string;
    active: boolean;
    config: Record<string, string>;
    fields: { name: string }[];
    options: string[];
}

export default defineComponent({
    name: 'Origins',
    components: {
        General: defineAsyncComponent(() => import('./General.vue')),
        Config: defineAsyncComponent(() => import('./Config.vue')),
        // ProviderListImport: defineAsyncComponent(
        //     () => import('./ProviderListImport.vue'),
        // ),
    },
    setup() {
        const tm = useI18n();

        const tab = ref('general');

        const tabOptions = ref<Record<string, string>[]>([]);

        const origins = ref<Origin[]>([]);
        const availableProviders = ref<Provider[]>([]);

        const selected = ref<Origin | null>(null);

        function setTabOptions() {
            tabOptions.value = [
                {
                    label: tm.t('general'),
                    name: 'general',
                    component: 'general',
                },
                {
                    label: tm.t('config'),
                    name: 'config',
                    component: 'config',
                },
            ];

            if (!selected.value) {
                return;
            }

            // if (selected.value.provider.options.includes('import')) {
            //     tabOptions.value.push({
            //         label: tm.t('import'),
            //         name: 'import',
            //         component: 'provider-list-import',
            //     });
            // }
        }

        watch(() => selected.value, setTabOptions, { immediate: true });

        async function setAvailableProviders() {
            const { data } = await api.get<Provider[]>('admin/providers');

            // availableProviders.value = data;
        }

        async function setOrigins() {
            const { data } = await api.get<Origin[]>('admin/origins');

            origins.value = data;
            if (origins.value[0]) {
                selected.value = origins.value[0];
            }
        }

        function addNew() {}

        async function toggleStatus(origin: Origin) {
            await api
                .patch(`admin/origins/${origin.id}`, { active: origin.active })
                .catch(console.error);

            await setOrigins();
        }

        void setOrigins();
        // void setAvailableProviders();

        return {
            origins,
            selected,

            tab,
            tabOptions,

            setOrigins,
            addNew,
            toggleStatus,
        };
    },
});
</script>
