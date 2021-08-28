<template>
    <q-item class="q-px-none">
        <q-item-section>
            <q-item-label v-if="label && showLabel" overline>
                {{ label }}
            </q-item-label>
            <q-item-label>
                {{ getValue() }}
            </q-item-label>
        </q-item-section>
    </q-item>
</template>
<script lang="ts">
import { defineComponent, PropType } from 'vue';
import { useI18n } from 'vue-i18n';

export default defineComponent({
    name: 'YsI18n',
    props: {
        type: {
            type: String as PropType<'normal' | 'number' | 'date'>,
            default: 'normal',
        },
        args: {
            type: [Object, Array, String],
            default: () => ({}),
        },
        label: {
            type: String,
            default: null,
        },
        showLabel: {
            type: Boolean,
            default: false,
        },
        modelValue: {
            type: undefined as any,
            default: undefined,
        },
    },
    setup(props) {
        const tm = useI18n();

        const methods = {
            normal: () => tm.t(props.modelValue, props.args),
            number: () => tm.n(Number(props.modelValue), props.args),
            date: () => tm.d(props.modelValue, props.args),
        };

        const getValue = methods[props.type];

        return {
            getValue,
        };
    },
});
</script>
