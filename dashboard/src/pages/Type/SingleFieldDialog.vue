<template>
    <q-dialog ref="dialogRef" @hide="onDialogHide">
        <q-card class="q-dialog-plugin">
            <q-card-section>
                <q-input v-model="field.name" :label="$t('name')" />
                <q-select
                    v-model="field.type"
                    :label="$t('type')"
                    :options="['mapped', 'editable']"
                />
                <ys-json-editor
                    v-model="field.options"
                    :label="$tc('option', 2)"
                />
            </q-card-section>

            <q-card-actions align="right">
                <q-btn
                    color="primary"
                    flat
                    :label="$t('save')"
                    @click="onOKClick"
                />
                <q-btn
                    color="primary"
                    flat
                    :label="$t('cancel')"
                    @click="onCancelClick"
                />
            </q-card-actions>
        </q-card>
    </q-dialog>
</template>

<script lang="ts">
import { ref } from 'vue';
import { useDialogPluginComponent } from 'quasar';
import {
    findTypeField,
    updateTypeField,
    createTypeField,
} from './compositions';

export default {
    props: {
        typeId: {
            type: Number,
            required: true,
        },
        fieldId: {
            type: Number,
            default: null,
        },
    },
    emits: [...useDialogPluginComponent.emits],
    setup(props) {
        const field = ref({});
        const { dialogRef, onDialogHide, onDialogCancel, onDialogOK } =
            useDialogPluginComponent();

        async function setField() {
            field.value = await findTypeField(props.typeId, props.fieldId);
        }

        if (props.typeId && props.fieldId) {
            void setField();
        }

        async function save() {
            if (props.typeId && props.fieldId) {
                await updateTypeField(props.typeId, props.fieldId, field.value);
            } else {
                await createTypeField(props.typeId, field.value);
            }

            onDialogOK();
        }

        return {
            field,
            dialogRef,
            onDialogHide,
            onOKClick: save,
            onCancelClick: onDialogCancel,
            onDialogOK,
        };
    },
};
</script>
