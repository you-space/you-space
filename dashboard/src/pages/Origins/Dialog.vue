<template>
    <q-dialog ref="dialogRef" @hide="onDialogHide">
        <q-card class="q-dialog-plugin">
            <q-form @submit="onOKClick">
                <q-card-section class="q-gutter-y-sm">
                    <div class="text-h6">
                        {{ $t('addNew') }}
                    </div>

                    <q-input
                        v-model="origin.name"
                        filled
                        :label="$t('name')"
                        :rules="[$helper.rules.required]"
                    />
                    <q-select
                        v-model="origin.providerName"
                        filled
                        option-label="name"
                        option-value="id"
                        :label="$t('provider')"
                        :rules="[$helper.rules.required]"
                        :options="providers"
                        emit-value
                    />
                </q-card-section>

                <q-card-actions align="right">
                    <q-btn
                        color="primary"
                        flat
                        :label="$t('cancel')"
                        @click="onCancelClick"
                    />
                    <q-btn
                        color="primary"
                        flat
                        :label="$t('save')"
                        type="submit"
                    />
                </q-card-actions>
            </q-form>
        </q-card>
    </q-dialog>
</template>

<script lang="ts">
import { useDialogPluginComponent } from 'quasar';
import { ref } from 'vue';
import { fetchProviders, Provider } from './composition';

export default {
    props: {},

    emits: [...useDialogPluginComponent.emits],

    setup() {
        const { dialogRef, onDialogHide, onDialogOK, onDialogCancel } =
            useDialogPluginComponent();

        const origin = ref({
            name: '',
            providerName: '',
        });

        const providers = ref<Provider[]>([]);

        async function setProviders() {
            providers.value = await fetchProviders();
        }

        void setProviders();

        return {
            origin,
            providers,

            dialogRef,
            onDialogHide,
            onOKClick() {
                onDialogOK(origin.value);
            },
            onCancelClick: onDialogCancel,
        };
    },
};
</script>
