<template>
    <q-card bordered flat class="video-picker">
        <div class="relative" :style="style">
            <ys-video v-if="src && !loading" :src="src" />

            <div
                v-if="readonly"
                class="
                    absolute-center
                    full-height full-width
                    img-picker-overlay
                "
            />

            <div
                v-else
                class="
                    absolute-center
                    full-height full-width
                    img-picker-overlay
                "
                @click="showPicker"
            >
                <q-file
                    ref="picker"
                    v-model="file"
                    class="hidden"
                    accept=".mp4"
                    autoplay=""
                />

                <div
                    class="absolute-center text-white flex column items-center"
                >
                    <q-icon
                        class="img-picker-actions"
                        color="white"
                        size="80px"
                        name="file_upload"
                    />

                    <div class="flex img-picker-actions">
                        <q-btn
                            v-if="
                                innerSrc || (model && model !== originalValue)
                            "
                            color="warning"
                            class="q-mr-sm"
                            @click.stop="reset"
                        >
                            {{ $t('reset') }}
                        </q-btn>
                        <q-btn color="primary" :loading="loading">
                            {{ $t('upload', ['video']) }}
                        </q-btn>
                    </div>
                </div>
            </div>
        </div>
    </q-card>
</template>
<script lang="ts">
import { defineComponent, computed, ref } from 'vue';
import { QFile } from 'quasar';

import { useTypeField } from './compositions';

export default defineComponent({
    name: 'TypeFieldVideo',
    inheritAttrs: false,
    props: {
        ...useTypeField.props,
        style: {
            type: [String, Object],
            default: () => ({}),
        },
    },
    emits: [...useTypeField.emits],
    setup(props, { emit }) {
        const innerSrc = ref<string | null>(null);
        const picker = ref<QFile | null>(null);
        const loading = ref(false);

        const { model } = useTypeField(props, emit);

        const src = computed(() => {
            const value = model.value as File | null;

            if (value && value.name) {
                return URL.createObjectURL(value);
            }

            if (typeof props.modelValue === 'string') {
                return props.modelValue;
            }

            if (props.originalValue) {
                return props.originalValue;
            }

            return null;
        });

        const file = computed({
            get: function () {
                if (typeof model.value === 'string') {
                    return null;
                }

                const value = model.value as File | null;

                if (value && value.name) {
                    return value;
                }

                return null;
            },
            set: function (value: File | null) {
                if (typeof value === 'string') {
                    return;
                }

                if (!value || !value.name) {
                    model.value = null;
                    return;
                }

                model.value = value;
            },
        });

        function showPicker() {
            if (picker.value) {
                picker.value.pickFiles();
            }
        }

        function setFile(file: File) {
            loading.value = true;

            const url = URL.createObjectURL(file);

            innerSrc.value = url;

            model.value = file;

            setTimeout(() => (loading.value = false), 800);
        }

        function reset() {
            model.value = null;
            innerSrc.value = null;
        }

        return {
            model,
            src,
            innerSrc,
            picker,
            reset,
            loading,
            file,

            showPicker,
            setFile,
        };
    },
});
</script>

<style lang="scss">
.video-picker {
    min-height: 300px;
    .img-picker-overlay {
        background-color: rgba(0, 0, 0, 0.7);
        cursor: pointer;
    }

    .img-picker-actions {
        opacity: 0;
        transition: opacity var(--q-transition-duration);
    }

    &:hover {
        .img-picker-actions {
            opacity: 1;
        }
    }
}
</style>
