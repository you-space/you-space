<template>
    <q-card-section>
        <h1 class="text-h2 text-bold">{{ origin.name }}</h1>
        <h2 class="text-h5">{{ origin.type }}</h2>
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
    </q-card-actions>

    <origin-list-dialog
        v-model="dialog"
        :origin-id="originId"
        @save="setOrigin"
    />
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
        OriginListDialog: defineAsyncComponent(
            () => import('src/pages/OriginListDialog.vue'),
        ),
    },
    props: {
        originId: {
            type: [Number, String],
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

        const dialog = ref(false);
        const tab = ref(0);

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
            tab,
            setOrigin,
            dialog,
            deleteOrigin,
        };
    },
});
</script>
