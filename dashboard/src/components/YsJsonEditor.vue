<template>
    <q-input v-model="innerString" type="textarea" v-bind="$attrs" />
</template>

<script lang="ts">
import lodash from 'lodash';
import { defineComponent, computed, watch, ref } from 'vue';
import { useHelper } from 'src/boot/helper';

export default defineComponent({
    props: {
        modelValue: {
            type: [Object, Array],
            default: () => ({}),
        },
    },
    emits: ['update:modelValue'],
    setup(props, { emit }) {
        const helper = useHelper();

        const innerString = ref('{}');

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
            (value) => {
                if (!helper.isJsonString(innerString.value)) {
                    return;
                }

                if (!lodash.isEqual(value, JSON.parse(innerString.value))) {
                    innerString.value = JSON.stringify(props.modelValue);
                }
            },
            { immediate: true },
        );

        watch(
            () => innerString.value,
            (value) => {
                if (helper.isJsonString(value)) {
                    model.value = JSON.parse(value);
                }
            },
        );

        return {
            model,
            innerString,
        };
    },
});
</script>
