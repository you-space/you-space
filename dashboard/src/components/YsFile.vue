<template>
    <q-card bordered flat>
        <q-card-section v-if="type === 'image'">
            <ys-img :model-value="preview" style="max-height: 180px" />
        </q-card-section>
        <q-item>
            <q-item-section v-if="type === 'normal'" avatar>
                <q-avatar
                    rounded
                    color="primary"
                    text-color="white"
                    icon="description"
                />
            </q-item-section>

            <q-item-section>
                <q-item-label v-if="file">
                    {{ file.name }}
                </q-item-label>
                <q-item-label v-else-if="modelValue">
                    <a :href="modelValue" target="_black">
                        {{ modelValue }}
                    </a>
                </q-item-label>
            </q-item-section>

            <q-item-section side>
                <q-btn icon="publish" round flat @click="showPicker" />
            </q-item-section>

            <q-file ref="picker" v-model="file" class="hidden" />
        </q-item>
    </q-card>
</template>
<script lang="ts">
import { defineComponent, ref, computed, watch } from 'vue';
import { QFile } from 'quasar';

import { useHelper } from 'src/boot/helper';
import { useFilesToUpload } from 'src/pages/TypeItem/compositions/use-item-files';

export default defineComponent({
    props: {
        modelValue: {
            type: [String, File],
            default: null,
        },
        name: {
            type: String,
            required: true,
        },
        type: {
            type: String,
            default: 'normal',
        },
    },
    emits: ['update:modelValue'],
    setup(props, { emit }) {
        const helper = useHelper();
        const itemFiles = useFilesToUpload();

        const base64Preview = ref();
        const picker = ref<QFile>();
        const file = ref<File>();

        const preview = computed(() => {
            if (base64Preview.value) {
                return base64Preview.value;
            }
            if (typeof props.modelValue === 'string') {
                return props.modelValue;
            }

            return null;
        });

        function showPicker() {
            if (picker.value) {
                picker.value.pickFiles();
            }
        }

        if (props.type === 'image' && itemFiles) {
            watch(
                () => file.value,
                async (value) => {
                    if (!value) {
                        delete itemFiles.value[props.name];
                        return;
                    }

                    itemFiles.value[props.name] = value;

                    base64Preview.value = await helper.getFileBase64(value);
                },
            );
        }

        return {
            picker,
            file,
            preview,

            showPicker,
        };
    },
});
</script>
