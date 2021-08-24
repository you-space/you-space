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
                                    :class="!origin.valid ? 'bg-red-3' : ''"
                                    @click="showOrigin(origin)"
                                >
                                    <q-item-section>
                                        <q-item-label>
                                            {{ origin.name }}
                                            {{
                                                !origin.valid
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
import {
    defineComponent,
    ref,
    defineAsyncComponent,
    watch,
    computed,
} from 'vue';
import { useQuasar } from 'quasar';
import { useI18n } from 'vue-i18n';
import { useRoute, useRouter } from 'vue-router';

import { api } from 'src/boot/axios';
import { fetchOrigins, Origin } from 'src/pages/Origins/composition';

export default defineComponent({
    name: 'Origins',
    components: {
        General: defineAsyncComponent(() => import('./General.vue')),
        Config: defineAsyncComponent(() => import('./Config.vue')),
        Import: defineAsyncComponent(() => import('./Import.vue')),
    },
    props: {
        id: {
            type: [Number, String],
            default: null,
        },
    },
    setup(props) {
        const tm = useI18n();
        const quasar = useQuasar();
        const router = useRouter();
        const route = useRoute();

        const tab = computed<string>({
            get() {
                return route.query.tab as string;
            },
            set(value) {
                void router.push({
                    query: { tab: value },
                });
            },
        });

        const tabOptions = ref<Record<string, string>[]>([]);

        const origins = ref<Origin[]>([]);

        const selected = computed<Origin | null>(() => {
            const origin = origins.value.find((o) => o.id === Number(props.id));

            return origin || null;
        });

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

            if (selected.value.options.includes('import')) {
                tabOptions.value.push({
                    label: tm.t('import'),
                    name: 'import',
                    component: 'import',
                });
            }
        }

        watch(() => selected.value, setTabOptions, { immediate: true });

        async function setOrigins() {
            const { data } = await fetchOrigins();
            origins.value = data;
        }

        function addNew() {
            quasar
                .dialog({
                    title: tm.t('addNew'),
                    component: defineAsyncComponent(
                        () => import('./Dialog.vue'),
                    ),
                })
                .onOk(async (data: { name: string; providerName: string }) => {
                    await api.post(`admin/origins`, {
                        name: data.name,
                        providerName: data.providerName,
                    });

                    await setOrigins();
                });
        }

        async function toggleStatus(origin: Origin) {
            await api
                .patch(`admin/origins/${origin.id}`, { active: origin.active })
                .catch(console.error);

            await setOrigins();
        }

        void setOrigins();

        function showOrigin(origin: Origin) {
            return router.push({
                name: 'origins-single',
                query: {
                    tab: 'general',
                },
                params: {
                    id: origin.id,
                },
            });
        }

        return {
            origins,
            selected,
            showOrigin,

            tab,
            tabOptions,

            setOrigins,
            addNew,
            toggleStatus,
        };
    },
});
</script>
