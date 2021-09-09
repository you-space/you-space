<template>
    <q-dialog ref="dialogRef" @hide="onDialogHide">
        <q-card style="width: 100%; max-width: 1000px">
            <q-card-section class="text-h6">
                {{ fieldId ? $t('edit', [field.name]) : $t('add', ['new']) }}
            </q-card-section>

            <q-card-section>
                <q-input
                    v-model="field.name"
                    class="q-mb-md"
                    filled
                    :label="$t('name')"
                />
                <q-select
                    v-model="field.type"
                    filled
                    class="q-mb-md"
                    :label="$t('type')"
                    :options="['mapped', 'editable', 'file']"
                />
                <q-input
                    v-if="field.type === 'mapped'"
                    v-model="field.options.path"
                    filled
                    :label="$t('path')"
                />
            </q-card-section>

            <q-card-section class="text-h6 text-bold">
                {{ $t('options') }}
            </q-card-section>

            <q-tabs v-model="tab" align="justify">
                <q-tab name="main" :label="$t('main')" />
                <q-tab name="table" :label="$t('table')" />
                <q-tab name="single" :label="$t('single')" />
            </q-tabs>

            <q-card-section>
                <q-toggle
                    v-model="currentOptions.show"
                    :label="$t('show')"
                    class="q-mb-md"
                />

                <q-input
                    v-model="currentOptions.order"
                    type="number"
                    class="q-mb-md"
                    :label="$t('order')"
                    filled
                />

                <q-select
                    v-model="currentOptions.component"
                    filled
                    :label="$t('component')"
                    :options="componentOptions"
                    clearable
                    class="q-mb-md"
                />

                <ys-object
                    v-model="currentOptions.componentProps"
                    :label="$t('componentProps')"
                    :initial-value="currentOptions.componentProps"
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
import lodash from 'lodash';
import { ref, defineComponent, computed } from 'vue';
import { useDialogPluginComponent } from 'quasar';
import {
    findTypeField,
    updateTypeField,
    createTypeField,
    TypeField,
} from './compositions';

export default defineComponent({
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
        const { dialogRef, onDialogHide, onDialogCancel, onDialogOK } =
            useDialogPluginComponent();

        const field = ref<any>({
            options: {
                table: {},
                single: {},
            },
        });

        const tab = ref('main');

        const componentOptions = ['YsVideo', 'YsImage', 'YsFile', 'YsI18n'];

        const currentOptions = computed({
            get() {
                if (tab.value === 'main') {
                    return field.value.options;
                }

                return field.value.options[tab.value];
            },
            set(value: any) {
                if (tab.value === 'main') {
                    field.value.options = {
                        ...value,
                    };
                    return;
                }

                field.value.options[tab.value] = {
                    ...value,
                };
            },
        });

        async function setField() {
            const data = await findTypeField(props.typeId, props.fieldId);

            const defaulOptions = {
                show: undefined,
                component: undefined,
                componentProps: {},
            };

            data.options = lodash.merge(data.options, defaulOptions);

            data.options.single = lodash.merge(
                data.options.single || {},
                defaulOptions,
            );
            data.options.table = lodash.merge(
                data.options.table || {},
                defaulOptions,
            );

            field.value = data;
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
            tab,
            field,
            dialogRef,
            componentOptions,
            currentOptions,

            onDialogHide,
            onOKClick: save,
            onCancelClick: onDialogCancel,
            onDialogOK,
        };
    },
});
</script>
