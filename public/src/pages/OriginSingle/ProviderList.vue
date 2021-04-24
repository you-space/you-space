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
                        @click="tab = provider.id"
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

        <div class="col-9 q-pa-md relative">
            <provider-list-config
                v-if="currentProvider"
                :provider-name="currentProvider.name"
                :fields="currentProvider.fields"
                :config="currentProvider.config"
                :origin-id="originId"
                @save="setProviderList"
            />
            <div v-else class="absolute-center">
                {{ $t('selectAItem') }}
            </div>
        </div>
    </div>
</template>
<script lang="ts">
import { api } from 'src/boot/axios';
import { defineComponent, ref, defineAsyncComponent, computed } from 'vue';
import { useQuasar } from 'quasar';
import { useI18n } from 'vue-i18n';

interface Provider {
    name: string;
    active: boolean;
}

export default defineComponent({
    components: {
        ProviderListConfig: defineAsyncComponent(
            () => import('./ProviderListConfig.vue'),
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

        const providers = ref<Provider[]>([]);
        const availableProviders = ref<Provider[]>([]);
        const tab = ref(0);
        const dialog = ref(false);

        const currentProvider = computed(() => providers.value[tab.value]);

        async function setProviderList() {
            const { data } = await api.get<Provider[]>(
                `admin/origins/${props.originId}/providers`,
            );
            providers.value = data.map((p, index) => ({
                ...p,
                id: index,
            }));
        }

        void setProviderList();

        async function setAvailableProviders() {
            const { data } = await api.get<Provider[]>('admin/providers');

            availableProviders.value = data;

            console.log(availableProviders.value, data);
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
                title: tm.t('add', [tm.t('provider').toLowerCase()]),
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
                    `admin/origins/${props.originId}/providers/${provider.name}`,
                    { active: provider.active },
                )
                .catch(setProviderList);
        }

        return {
            tab,
            dialog,
            providers,

            currentProvider,
            setProviderList,
            showDialog,
            toggleProviderStatus,
        };
    },
});
</script>
