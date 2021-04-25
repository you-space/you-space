<template>
    <div class="row full-width full-height">
        <div class="col-3 border-r border-grey-4 relative">
            <div v-if="!providers.length" class="absolute-center row column">
                <span class="text-center q-mb-sm">
                    {{ $tc('noItem', 2) }}
                </span>
                <q-btn :label="$t('addNew')" @click="showDialog" />
            </div>

            <q-list v-else separator>
                <template v-for="provider in providers" :key="provider.name">
                    <q-item
                        clickable
                        :class="!provider.valid ? 'bg-red-3' : ''"
                        @click="currentProvider = provider"
                    >
                        <q-item-section>
                            <q-item-label>
                                {{ provider.name }}
                                {{
                                    !provider.valid ? `(${$t('notFound')})` : ''
                                }}
                            </q-item-label>
                            <q-item-label caption>
                                {{ provider.description }}
                            </q-item-label>
                        </q-item-section>
                        <q-item-section avatar>
                            <q-toggle
                                v-model="provider.active"
                                @update:model-value="
                                    toggleProviderStatus(provider)
                                "
                            />
                        </q-item-section>
                    </q-item>
                </template>
                <q-item clickable @click="showDialog">
                    <q-item-section>
                        <q-item-label>
                            {{ $t('add', [$t('provider').toLowerCase()]) }}
                        </q-item-label>
                    </q-item-section>
                    <q-item-section avatar>
                        <q-icon name="add"></q-icon>
                    </q-item-section>
                </q-item>
            </q-list>
        </div>

        <div class="col-9 relative">
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

            <q-tab-panels v-if="currentProvider" v-model="tab">
                <q-tab-panel
                    v-for="option in tabOptions"
                    :key="option.name"
                    :name="option.name"
                >
                    <component
                        :is="option.component"
                        :provider="currentProvider"
                        @reload="setProviderList"
                    />
                </q-tab-panel>
            </q-tab-panels>

            <div v-else class="absolute-center">
                {{ $t('selectAItem') }}
            </div>
        </div>
    </div>
</template>
<script lang="ts">
import { api } from 'src/boot/axios';
import { defineComponent, ref, defineAsyncComponent, watch } from 'vue';
import { useQuasar } from 'quasar';
import { useI18n } from 'vue-i18n';

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
    components: {
        ProviderListConfig: defineAsyncComponent(
            () => import('./ProviderListConfig.vue'),
        ),
        ProviderListImport: defineAsyncComponent(
            () => import('./ProviderListImport.vue'),
        ),
    },
    props: {
        originId: {
            type: [String, Number],
            required: true,
        },
    },
    setup(props) {
        const $q = useQuasar();
        const tm = useI18n();

        const tab = ref();

        const tabOptions = ref<Record<string, string>[]>([]);

        const providers = ref<Provider[]>([]);
        const availableProviders = ref<Provider[]>([]);

        const currentProvider = ref<Provider | null>(null);

        async function setProviderList() {
            const { data } = await api.get<Provider[]>(
                `admin/origins/${props.originId}/providers`,
            );

            currentProvider.value = data[0] || null;

            providers.value = data;
        }

        void setProviderList();

        function setTabOptions() {
            tab.value = 'config';

            tabOptions.value = [
                {
                    label: tm.t('config'),
                    name: 'config',
                    component: 'provider-list-config',
                },
            ];

            if (!currentProvider.value) {
                return;
            }
            if (currentProvider.value.options.includes('import')) {
                tabOptions.value.push({
                    label: tm.t('import'),
                    name: 'import',
                    component: 'provider-list-import',
                });
            }
        }

        watch(() => currentProvider.value, setTabOptions, { immediate: true });

        async function setAvailableProviders() {
            const { data } = await api.get<Provider[]>('admin/providers');

            availableProviders.value = data;
        }

        void setAvailableProviders();

        async function addProvider(name: string) {
            await api.post(`admin/origins/${props.originId}/providers`, {
                name,
            });

            await setProviderList();
        }

        function showDialog() {
            $q.dialog({
                title: tm.t('availableProviders'),
                message: tm.t('youCanGetMoreWithPlugins'),
                cancel: true,
                options: {
                    type: 'radio',
                    model: '',
                    items: availableProviders.value.map((p) => ({
                        label: p.name,
                        value: p.name,
                    })),
                },
            }).onOk(addProvider);
        }

        async function toggleProviderStatus(provider: Provider) {
            await api
                .patch(
                    `admin/origins/${props.originId}/providers/${provider.id}`,
                    { active: provider.active },
                )
                .catch(setProviderList);
        }

        return {
            tab,
            tabOptions,

            providers,

            currentProvider,
            setProviderList,
            showDialog,
            toggleProviderStatus,
        };
    },
});
</script>
