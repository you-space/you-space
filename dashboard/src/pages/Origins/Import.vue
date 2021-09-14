<template>
    <div class="row items-center">
        <q-item-label class="text-bold text-subtitle1 col-12 q-mb-md">
            {{ $t('scheduleImportFor') }}
        </q-item-label>

        <div
            v-for="option in options"
            :key="option.value"
            class="col-6 col-xl-2 q-pr-sm q-pb-sm"
        >
            <q-btn
                :color="
                    model.schedule.repeatEach === option.value
                        ? 'primary'
                        : 'primary '
                "
                :label="option.label"
                class="full-width"
                @click="model.schedule.repeatEach = option.value"
            />
        </div>

        <div class="col-6 col-xl-2 q-pr-sm q-pb-sm q-mt-lg">
            <q-btn
                :label="$t('import', ['now'])"
                icon="send"
                color="primary"
                class="full-width"
                outline
                @click="importNow"
            />
        </div>
    </div>
</template>

<script lang="ts">
import { useVModel } from '@vueuse/core';
import { useQuasar } from 'quasar';
import { defineComponent, PropType } from 'vue';
import { useI18n } from 'vue-i18n';
import { Origin, importOriginData } from './composition';

export default defineComponent({
    props: {
        origin: {
            type: Object as PropType<Origin>,
            required: true,
        },
    },
    setup(props, { emit }) {
        const tm = useI18n();

        const quasar = useQuasar();

        const model = useVModel(props, 'origin', emit);

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

        function importNow() {
            quasar
                .dialog({
                    title: tm.t('confirm'),
                    message: tm.t('thisWillStartTheImportIme'),
                    cancel: true,
                })
                .onOk(async () => {
                    await importOriginData(props.origin.id);
                });
        }

        return {
            model,
            options,

            importNow,
        };
    },
});
</script>
