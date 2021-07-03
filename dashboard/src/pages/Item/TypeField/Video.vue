<template>
    <q-card bordered flat class="video-picker">
        <div class="relative" :style="style">
            <ys-video v-if="src" :src="src" />
        </div>
    </q-card>
</template>
<script lang="ts">
import { defineComponent, computed, ref, watch } from 'vue';
import { createTypeField  } from './compositions';

const typeField = createTypeField();

export default defineComponent({
    name: 'TypeFieldVideo',
    inheritAttrs: false,
    props: {
        ...typeField.props,
        style: {
            type: [String, Object],
            default: () => ({}),
        },
    },
    emits: [...typeField.emits],
    setup(props, { emit }) {

        const innerSrc = ref<string | null>(null);

        const src = computed(() => {
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
