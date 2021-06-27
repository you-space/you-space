<template>
    <q-card bordered flat class="img-picker">
        <q-card-section class="flex justify-between">
            <div class="text-body2">{{ label }}</div>
            <template v-if="showViewOriginalButton">
                <q-btn
                    v-if="!viewOriginal"
                    size="sm"
                    @click="viewOriginal = true"
                >
                    {{ $t('viewOriginal') }}
                </q-btn>
                <q-btn v-else size="sm" @click="viewOriginal = false">
                    {{ $t('back') }}
                </q-btn>
            </template>
        </q-card-section>

        <div
            class="relative"
            :class="[readonly ? '' : 'cursor-pointer']"
            @click="showPicker"
        >
            <q-img v-if="preview" :src="preview" height="210px" />

            <q-icon
                v-else
                class="full-width bg-grey-5"
                color="white"
                size="80px"
                name="image"
                style="height: 210px"
            />

            <template v-if="!readonly">
                <q-file ref="picker" v-model="model" class="hidden" />

                <div
                    class="absolute-center full-height full-width img-picker-overlay"
                    style="background-color: rgba(0, 0, 0, 0.4)"
                >
                    <q-icon
                        v-if="!model"
                        class="absolute-center"
                        color="white"
                        size="80px"
                        name="file_upload"
                    />

                    <div v-else class="absolute-bottom-left q-pa-md">
                        <q-btn color="primary" size="sm" @click.stop="reset">
                            {{ $t('reset') }}
                        </q-btn>
                    </div>
                </div>
            </template>
        </div>
    </q-card>
</template>
<script lang="ts">
import { QFile } from 'quasar';
import { useHelper } from 'src/boot/helper';
import { defineComponent, computed, ref, watch } from 'vue';

export default defineComponent({
    name: 'TypeFieldImage',
    inheritAttrs: false,
    props: {
        label: {
            type: String,
            default: null,
        },
        originalValue: {
            type: String,
            default: null,
        },
        currentValue: {
            type: String,
            default: null,
        },
        modelValue: {
            type: [String, Object],
            default: null,
        },
        readonly: {
            type: Boolean,
            default: false,
        },
    },
    emits: ['update:modelValue'],
    setup(props, { emit }) {
        const helper = useHelper();

        const innerSrc = ref<string | null>(null);
        const picker = ref<QFile>();
        const viewOriginal = ref(false);

        const preview = computed(() => {
            if (viewOriginal.value) {
                return props.originalValue;
            }

            if (innerSrc.value) {
                return innerSrc.value;
            }

            if (props.currentValue) {
                return props.currentValue;
            }

            if (props.originalValue) {
                return props.originalValue;
            }

            return null;
        });

        const model = computed<File | null | undefined>({
            get() {
                if (typeof props.modelValue === 'string') {
                    return null;
                }
                return props.modelValue;
            },
            set(value) {
                emit('update:modelValue', value);
            },
        });

        const showViewOriginalButton = computed(() => {
            if (model.value) {
                return true;
            }

            if (
                props.currentValue &&
                props.originalValue !== props.currentValue
            ) {
                return true;
            }

            return false;
        });

        function showPicker() {
            if (picker.value) {
                picker.value.pickFiles();
            }
        }

        function reset() {
            model.value = undefined;
        }

        reset();

        watch(
            () => model.value,
            async () => {
                if (!model.value) {
                    innerSrc.value = null;
                    return;
                }

                const base64 = await helper.getFileBase64(model.value);

                viewOriginal.value = false;

                innerSrc.value = base64;
            },
        );

        return {
            model,
            preview,
            picker,
            viewOriginal,
            reset,
            showViewOriginalButton,

            showPicker,
        };
    },
});
</script>

<style lang="scss">
.img-picker {
    .img-picker-overlay {
        opacity: 0;
        transition: opacity var(--q-transition-duration);
    }

    &:hover {
        .img-picker-overlay {
            opacity: 1;
        }
    }
}
</style>
