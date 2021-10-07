<template>
    <q-dialog ref="dialogRef" @hide="onDialogHide">
        <q-card style="width: 100%; max-width: 500px">
            <q-form @submit="submit">
                <q-card-section>
                    <q-select
                        v-model="selected"
                        emit-value
                        map-options
                        option-label="name"
                        option-value="url"
                        use-input
                        new-value-mode="add"
                        :label="$t('selectAnOrTypeAGithubUrl')"
                        :options="options"
                    >
                        <template #option="scope">
                            <q-item v-bind="scope.itemProps">
                                <q-item-section>
                                    <q-item-label
                                        class="mb-2"
                                        v-text="scope.opt.name"
                                    />
                                    <q-item-label caption>
                                        {{ scope.opt.url }}
                                    </q-item-label>
                                </q-item-section>
                            </q-item>
                        </template>
                    </q-select>
                </q-card-section>
                <q-card-actions>
                    <q-btn
                        :label="$t('add')"
                        type="submit"
                        color="primary"
                        :loading="loading"
                        flat
                    />
                    <q-btn
                        :label="$t('cancel')"
                        color="primary"
                        flat
                        @click="cancel"
                    />
                </q-card-actions>
            </q-form>
        </q-card>
    </q-dialog>
</template>

<script lang="ts">
import { defineComponent, ref } from 'vue';

import { useDialogPluginComponent } from 'quasar';
import { fetchOfficialPlugins, downloadPlugin } from './compositions';

export default defineComponent({
    emits: [...useDialogPluginComponent.emits],
    setup() {
        const { dialogRef, onDialogHide, onDialogOK, onDialogCancel } =
            useDialogPluginComponent();

        const options = ref<any[]>([]);
        const selected = ref();
        const loading = ref(false);

        async function setOptions() {
            const items = await fetchOfficialPlugins();

            options.value = items;
        }

        void setOptions();

        async function submit() {
            loading.value = true;
            await downloadPlugin(selected.value)
                .catch(() => (loading.value = false))
                .then(() =>
                    setTimeout(() => {
                        onDialogOK();
                        loading.value = false;
                    }, 800),
                );
        }

        return {
            dialogRef,
            selected,
            options,
            loading,

            onDialogHide,
            submit,
            cancel: onDialogCancel,
        };
    },
});
</script>
