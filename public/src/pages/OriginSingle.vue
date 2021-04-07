<template>
    <q-page padding class="row items-stretch q-gutter-x-md">
        <div class="col">
            <q-card class="full-height flex column items-start">
                <q-card-section>
                    <h1 class="text-h2 text-bold">{{ origin.name }}</h1>
                    <h2 class="text-h5">{{ origin.type }}</h2>
                </q-card-section>

                <q-card-section class="flex q-gutter-x-md full-width">
                    <q-input
                        :model-value="$n(origin.metadata.totalVideos)"
                        :label="$t('totalVideos')"
                        readonly
                    />
                    <q-input
                        :model-value="$n(origin.videosCount)"
                        :label="$t('registeredVideos')"
                        readonly
                    />
                </q-card-section>

                <q-card-section
                    v-if="origin.type == 'you-tube'"
                    class="col-grow full-width"
                >
                    <q-input
                        :model-value="origin.config.apiKey"
                        :type="!showKey ? 'password' : 'text'"
                        :label="$t('apiKey')"
                        readonly
                    >
                        <template #append>
                            <q-icon
                                :name="
                                    !showKey ? 'visibility_off' : 'visibility'
                                "
                                class="cursor-pointer"
                                @click="showKey = !showKey"
                            />
                        </template>
                    </q-input>
                    <q-input
                        :model-value="origin.config.channelId"
                        :label="$t('channelId')"
                        readonly
                    >
                    </q-input>
                    <q-input
                        :model-value="$d(origin.createdAt)"
                        :label="$t('createdAt')"
                        readonly
                    />
                    <q-input
                        :model-value="$d(origin.updatedAt)"
                        :label="$t('updatedAt')"
                        readonly
                    />
                </q-card-section>
            </q-card>
        </div>
        <div class="col">
            <origin-single-logs />
        </div>
    </q-page>
</template>

<script lang="ts">
import { defineComponent, ref, defineAsyncComponent } from 'vue';
import { Origin } from 'src/types';
import { api } from 'src/boot/axios';
export default defineComponent({
    name: 'OriginSingle',
    components: {
        OriginSingleLogs: defineAsyncComponent(
            () => import('./OriginSingleLogs.vue'),
        ),
    },
    props: {
        originId: {
            type: Number,
            default: null,
        },
    },
    setup(props) {
        const origin = ref<Partial<Origin>>({
            name: '',
            type: '',
            videosCount: 0,
            metadata: { totalVideos: 0 },
        });
        const showKey = ref(false);
        async function setOrigin() {
            if (!props.originId) {
                return;
            }
            const { data } = await api.get<Origin>(
                `admin/origins/${props.originId}`,
            );

            origin.value = data;
        }

        async function importOriginVideos(id: number) {
            await api.post(`/admin/origins/import/${id}`);
            await setOrigin();
        }

        void setOrigin();

        return {
            origin,
            importOriginVideos,
            showKey,
        };
    },
});
</script>
