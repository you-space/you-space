<template>
    <q-form @submit="save">
        <div class="flex q-mb-md items-end">
            <h2 class="text-h6 q-my-none text-bold col-grow">
                {{ $t('scheduleImports') }}
            </h2>
            <div class="q-gutter-sm">
                <q-btn
                    :label="$t('importNow')"
                    color="warning"
                    @click="importNow"
                />
                <q-btn
                    type="submit"
                    :loading="loading"
                    :label="$t('save')"
                    color="primary"
                />
            </div>
        </div>
        <div>
            <q-select
                v-model="repeatEach"
                :options="options"
                map-options
                emit-value
                outlined
                dense
                :label="$t('frequency')"
            />
        </div>
    </q-form>
</template>

<script lang="ts">
import { defineComponent, PropType, ref } from 'vue';
import { useI18n } from 'vue-i18n';
import {
    Origin,
    importOriginData,
    findOriginScheduler,
    updateOriginScheduler,
} from './composition';

export default defineComponent({
    props: {
        origin: {
            type: Object as PropType<Origin>,
            required: true,
        },
    },
    setup(props) {
        const loading = ref(false);
        const tm = useI18n();

        const repeatEach = ref();

        const options = [
            {
                label: tm.t('none'),
                value: 'none',
            },
            {
                label: tm.t('each', ['minute']),
                value: 'minute',
            },
            {
                label: tm.t('each', ['hour']),
                value: 'hour',
            },
            {
                label: tm.t('each', ['day']),
                value: 'day',
            },
            {
                label: tm.t('each', ['week']),
                value: 'week',
            },
            {
                label: tm.t('each', ['month']),
                value: 'month',
            },
        ];

        async function importNow() {
            await importOriginData(props.origin.id);
        }

        async function setScheduleImporter() {
            const data = await findOriginScheduler(props.origin.id);

            repeatEach.value = data.repeatEach;

            console.log(data);
        }

        void setScheduleImporter();

        async function save() {
            await updateOriginScheduler(props.origin.id, {
                repeatEach: repeatEach.value,
            });

            await setScheduleImporter();
        }

        return {
            loading,
            repeatEach,
            options,

            importNow,
            save,
        };
    },
});
</script>
