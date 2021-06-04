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
import { defineComponent, PropType, ref, watch } from 'vue';
import { saveOrigin, Origin } from './composition';

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
            name: '',
            providerName: '',
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

        function setOrigin() {
            data.value.name = props.origin.name;
            data.value.providerName = props.origin.providerName;
        }

        watch(() => props.origin.id, setOrigin, { immediate: true });

        return {
            data,
            loading,

            save,
        };
    },
});
</script>
