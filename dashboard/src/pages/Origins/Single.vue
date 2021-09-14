<template>
    <q-page padding>
        <q-card class="relative" flat bordered>
            <q-inner-loading :showing="loading" />
            <q-form @submit="save">
                <div
                    v-for="(option, index) in options"
                    :key="option.name"
                    :name="option.name"
                >
                    <q-separator v-if="index > 0" />

                    <q-card-section class="text-h5">
                        {{ option.label }}
                    </q-card-section>

                    <q-card-section>
                        <component :is="option.component" :origin="origin" />
                    </q-card-section>
                </div>

                <q-card-actions align="right">
                    <q-btn
                        color="negative"
                        :label="$t('cancel')"
                        style="width: 90px"
                        @click="setOrigin"
                    />
                    <q-btn
                        color="positive"
                        :label="$t('save')"
                        style="width: 90px"
                        type="submit"
                    />
                </q-card-actions>
            </q-form>
        </q-card>
    </q-page>
</template>
<script lang="ts">
import { defineComponent, ref, defineAsyncComponent } from 'vue';
import { useI18n } from 'vue-i18n';

import { findOrigin, Origin, saveOrigin } from 'src/pages/Origins/composition';

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

        const loading = ref(false);

        const options = [
            {
                label: tm.t('general'),
                name: 'general',
                component: 'general',
            },
            {
                label: tm.t('import'),
                name: 'import',
                component: 'import',
            },
            {
                label: tm.t('config'),
                name: 'config',
                component: 'config',
            },
        ];

        const origin = ref<Partial<Origin>>({
            name: '',
            providerName: '',
            fields: [],
            config: {},
            schedule: {},
        });

        async function setOrigin() {
            loading.value = true;
            origin.value = await findOrigin(props.id);

            setTimeout(() => (loading.value = false), 800);
        }

        void setOrigin();

        async function save() {
            await saveOrigin(props.id, origin.value);

            await setOrigin();
        }

        return {
            loading,
            origin,
            options,

            setOrigin,
            save,
        };
    },
});
</script>
