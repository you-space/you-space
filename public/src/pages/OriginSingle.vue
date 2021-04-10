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
                        v-if="origin.createdAt"
                        :model-value="$d(origin.createdAt, 'long')"
                        :label="$t('createdAt')"
                        readonly
                    />
                    <q-input
                        v-if="origin.updatedAt"
                        :model-value="$d(origin.updatedAt, 'long')"
                        :label="$t('updatedAt')"
                        readonly
                    />
                </q-card-section>
                <q-separator class="full-width" />
                <q-card-actions>
                    <q-btn
                        color="primary"
                        style="width: 150px"
                        :label="$t('edit')"
                        @click="dialog = true"
                    />
                    <q-btn
                        color="negative"
                        style="width: 150px"
                        :label="$t('delete')"
                        @click="deleteOrigin"
                    />
                    <q-btn
                        color="positive"
                        style="width: 150px"
                        :label="$t('startImport')"
                        @click="importOriginVideos"
                    />
                </q-card-actions>
            </q-card>
        </div>
        <div class="col">
            <origin-single-logs v-if="originId" :origin-id="originId" />
        </div>
        <origin-list-dialog
            v-model="dialog"
            :origin-id="originId"
            @save="setOrigin"
        />
    </q-page>
</template>

<script lang="ts">
import { defineComponent, ref, defineAsyncComponent } from 'vue';
import { Origin } from 'src/types';
import { api } from 'src/boot/axios';
import { useI18n } from 'vue-i18n';
import { useRouter } from 'vue-router';
import { useQuasar } from 'quasar';

export default defineComponent({
    name: 'OriginSingle',
    components: {
        OriginSingleLogs: defineAsyncComponent(
            () => import('./OriginSingleLogs.vue'),
        ),
        OriginListDialog: defineAsyncComponent(
            () => import('./OriginListDialog.vue'),
        ),
    },
    props: {
        originId: {
            type: Number,
            default: null,
        },
    },
    setup(props) {
        const tm = useI18n();
        const router = useRouter();
        const $q = useQuasar();

        const origin = ref<Partial<Origin>>({
            name: '',
            type: '',
            videosCount: 0,
            metadata: { totalVideos: 0 },
            config: {},
            updatedAt: '',
            createdAt: '',
        });
        const showKey = ref(false);
        const dialog = ref(false);

        async function setOrigin() {
            if (!props.originId) {
                return;
            }
            const { data } = await api.get<Origin>(
                `admin/origins/${props.originId}`,
            );

            origin.value.name = data.name;
            origin.value.type = data.type;
            origin.value.videosCount = data.videosCount;
            origin.value.createdAt = data.createdAt;
            origin.value.updatedAt = data.updatedAt;

            if (data.metadata) {
                origin.value.metadata = {
                    totalVideos: data.metadata.totalVideos,
                };
            }
            origin.value.config = data.config;
        }

        async function importOriginVideos() {
            await api.post(`/admin/origins/import/${props.originId}`);
            await setOrigin();
        }

        function deleteOrigin() {
            $q.dialog({
                title: tm.t('areYouSure'),
                message: tm.t('thisActionCanNotBeUndone'),
                cancel: true,
                persistent: true,
            }).onOk(async () => {
                await api.delete(`/admin/origins/${props.originId}`);
                await router.push({ name: 'origin-list' });
            });
        }

        void setOrigin();

        return {
            origin,
            setOrigin,
            importOriginVideos,
            showKey,
            dialog,
            deleteOrigin,
        };
    },
});
</script>
