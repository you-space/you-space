<template>
    <q-card bordered flat class="video-picker">
        <q-card-section>
            <div class="text-body2">{{ label }}</div>
        </q-card-section>
        <div class="relative" :style="style">
            <ys-video v-if="src" :src="src" />
        </div>
    </q-card>
</template>
<script lang="ts">
import { QFile } from 'quasar';
import { useHelper } from 'src/boot/helper';
import { defineComponent, computed, ref, watch } from 'vue';

export default defineComponent({
    name: 'TypeFieldVideo',
    inheritAttrs: false,
    props: {
        label: {
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
        style: {
            type: [String, Object],
            default: () => ({}),
        },
    },
    emits: ['update:modelValue'],
    setup(props, { emit }) {
        const helper = useHelper();

        const innerSrc = ref<string | null>(null);
        // const picker = ref<QFile>();
        const originalSrc = ref<null | string>(null);

        const src = computed(() => {
            if (innerSrc.value) {
                return innerSrc.value;
            }

            if (originalSrc.value) {
                return originalSrc.value;
            }

            return null;
        });

        const model = computed<File | null>({
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

        // function showPicker() {
        //     if (picker.value) {
        //         picker.value.pickFiles();
        //     }
        // }

        // watch(
        //     () => model.value,
        //     async () => {
        //         if (!model.value) {
        //             innerSrc.value = null;
        //             return;
        //         }

        //         const base64 = await helper.getFileBase64(model.value);

        //         innerSrc.value = base64;
        //     },
        // );

        function preLoad() {
            if (props.modelValue && typeof props.modelValue === 'string') {
                originalSrc.value = props.modelValue;
                model.value = null;
            }
        }

        watch(() => props.modelValue, preLoad, { immediate: true });

        return {
            model,
            src,
            // preview,
            // picker,

            // showPicker,
        };
    },
});
</script>

<style lang="scss">
.video-picker {
    min-height: 300px;
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
