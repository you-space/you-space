<template>
    <q-dialog ref="dialogRef" @hide="onDialogHide">
        <q-card style="width: 100%; max-width: 500px">
            <q-form @submit="submit">
                <q-card-section>
                    <q-select
                        v-model="selected"
                        emit-value
                        map-options
                        use-input
                        new-value-mode="add"
                        :label="$t('selectAThemeOrTypeAGithubUrl')"
                        :options="options"
                    />
                </q-card-section>
                <q-card-actions>
                    <q-btn
                        :label="$t('add')"
                        type="submit"
                        color="primary"
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
import { downloadTheme } from './compositions';

export default defineComponent({
    emits: [...useDialogPluginComponent.emits],
    setup() {
        const { dialogRef, onDialogHide, onDialogOK, onDialogCancel } =
            useDialogPluginComponent();

        const options = [
            {
                label: 'Awake theme',
                value: 'https://github.com/you-space/awake-theme.git',
            },
            {
                label: 'Revolution theme',
                value: 'https://github.com/you-space/revolution.git',
            },
        ];

        const selected = ref();

        async function submit() {
            await downloadTheme(selected.value);
            onDialogOK();
        }

        return {
            dialogRef,
            selected,
            options,

            onDialogHide,
            submit,
            cancel: onDialogCancel,
        };
    },
});
</script>
