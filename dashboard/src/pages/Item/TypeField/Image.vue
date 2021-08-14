<template>
    <q-card bordered flat class="img-picker">
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
                    class="
                        absolute-center
                        full-height full-width
                        img-picker-overlay
                    "
                    style="background-color: rgba(0, 0, 0, 0.4)"
                >
                    <q-icon
                        v-if="!model"
                        class="absolute-center"
                        color="white"
                        size="80px"
                        name="file_upload"
                    />

                    <div v-if="model" class="absolute-bottom-left q-pa-md">
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
import { defineComponent, ref, computed, watch } from 'vue';
import { useHelper } from 'src/boot/helper';

export default defineComponent({
    props: {
        readonly: {
            type: Boolean,
            default: true,
        },
        modelValue: {
            type: [String, File],
            default: null,
        },
    },
    emits: ['update:modelValue'],
    setup(props, { emit }) {
        const helper = useHelper();

        const innerSrc = ref<string | null>(null);
        const picker = ref<QFile>();

        const preview = computed(() => {
            if (innerSrc.value) {
                return innerSrc.value;
            }

            if (typeof props.modelValue === 'string') {
                return props.modelValue;
            }

            return null;
        });

        const model = computed({
            get() {
                return props.modelValue;
            },
            set(value) {
                emit('update:modelValue', value);
            },
        });

        watch(
            () => model.value,
            async () => {
                if (!model.value || typeof model.value === 'string') {
                    innerSrc.value = null;
                    return;
                }

                const base64 = await helper.getFileBase64(model.value as File);

                innerSrc.value = base64;
            },
        );

        function showPicker() {
            if (picker.value) {
                picker.value.pickFiles();
            }
        }

        function reset() {
            model.value = null;
        }

        return {
            picker,

            preview,
            model,

            showPicker,
            reset,
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
