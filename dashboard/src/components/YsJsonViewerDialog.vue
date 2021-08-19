<template>
    <q-dialog ref="dialogRef" @hide="onDialogHide">
        <q-card>
            <q-card-section>
                <json-viewer :value="value" />
            </q-card-section>
        </q-card>
    </q-dialog>
</template>

<script>
import { useDialogPluginComponent } from 'quasar';

export default {
    props: {
        value: {
            type: Object,
            default: () => ({}),
        },
    },

    emits: [...useDialogPluginComponent.emits],

    setup() {
        const {
            dialogRef,
            onDialogHide,
            onDialogOK,
            onDialogCancel,
        } = useDialogPluginComponent();

        return {
            dialogRef,
            onDialogHide,
            onOKClick() {
                onDialogOK();
            },
            onCancelClick: onDialogCancel,
        };
    },
};
</script>
