<template>
    <q-form @submit="save">
        <div class="q-gutter-y-md">
            <q-input
                v-model="data.name"
                class="col-4 q-pr-sm"
                :label="$t('name')"
                outlined
                dense
            />
            <q-input
                v-model="data.providerName"
                class="col-4 q-pr-sm"
                :label="$t('providerName')"
                :loading="loading"
                outlined
                dense
                readonly
            />
            <q-btn color="primary" :label="$t('save')" type="submit" />
        </div>
    </q-form>
</template>

<script lang="ts">
import { defineComponent, PropType, ref } from 'vue';
import { Origin } from 'src/types';
import { saveOrigin } from './composition';

export default defineComponent({
    props: {
        origin: {
            type: Object as PropType<Origin>,
            required: true,
        },
    },
    emits: ['reload'],
    setup(props, { emit }) {
        const loading = ref(false);

        const data = ref({
            name: props.origin.name,
            providerName: props.origin.providerName,
        });

        async function save() {
            loading.value = true;
            await saveOrigin(props.origin.id, { name: data.value.name }).catch(
                () => (loading.value = false),
            );

            setTimeout(() => {
                loading.value = false;
                emit('reload');
            }, 800);
        }

        return {
            data,
            loading,

            save,
        };
    },
});
</script>
