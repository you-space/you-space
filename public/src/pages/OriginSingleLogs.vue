<template>
    <q-card class="full-height">
        <q-tabs
            v-model="tab"
            active-color="primary"
            inline-label
            align="justify"
        >
            <q-tab name="all" :label="$t('all')" />
            <q-tab name="error" :label="$t('errors')" />
            <q-tab name="info" :label="$t('logs')" />
        </q-tabs>

        <q-separator />

        <!-- <q-card-section> -->
        <q-list bordered separator style="height: calc(100% - 49px)">
            <q-scroll-area class="full-height">
                <q-item
                    v-for="log in displayLogs"
                    :key="log.id"
                    v-ripple
                    clickable
                    @click="showLog(log)"
                >
                    <q-item-section side>
                        <q-chip color="grey-7" text-color="white" square>
                            {{ log.type }}
                        </q-chip>
                    </q-item-section>
                    <q-item-section>
                        {{ log.message }}
                    </q-item-section>
                    <q-item-section side>
                        {{ $d(log.createdAt, 'long') }}
                    </q-item-section>
                </q-item>
            </q-scroll-area>
        </q-list>
        <!-- </q-card-section> -->
    </q-card>
</template>
<script lang="ts">
import { ref, defineComponent, computed, onUnmounted } from 'vue';
import { api } from 'src/boot/axios';
import { useQuasar } from 'quasar';
import { useSocketIo } from 'src/boot/socket-io';

interface Log {
    type: string;
    message: string;
    payload: Record<string, unknown>;
}

export default defineComponent({
    props: {
        originId: {
            type: Number,
            required: true,
        },
    },
    setup(props) {
        const logs = ref<Log[]>([]);
        const tab = ref('all');
        const socket = useSocketIo();

        const displayLogs = computed(() => {
            if (tab.value === 'all') {
                return logs.value;
            }
            return logs.value.filter((l) => l.type === tab.value);
        });

        const $q = useQuasar();

        async function setOriginLogs() {
            const { data } = await api.get<Log[]>(
                `/admin/origins/${String(props.originId)}/logs`,
            );

            logs.value = data;
        }

        function showLog(log: Log) {
            $q.dialog({
                title: log.message,
                html: true,
                message: `<pre class="bg-grey-9 text-white q-pa-sm rounded-borders" >${JSON.stringify(
                    log.payload,
                    null,
                    3,
                )}</pre>`,
            });
        }

        void setOriginLogs();
        socket.on('originLog:created', () => {
            void setOriginLogs();
        });

        socket.on('originLog:deleted', () => {
            void setOriginLogs();
        });

        onUnmounted(() => socket.disconnect());

        return {
            logs,
            displayLogs,
            tab,
            showLog,
        };
    },
});
</script>
