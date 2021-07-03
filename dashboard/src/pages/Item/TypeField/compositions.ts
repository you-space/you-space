import { computed } from 'vue';

export function createTypeField() {
    const props = {
        currentValue: {
            type: [String, Number, Object, Array],
            default: null,
        },
        originalValue: {
            type: [String, Number, Object, Array],
            default: null,
        },
        modelValue: {
            type: [String, Number, Object, Array, Blob],
            default: null,
        },
        readonly: {
            type: Boolean,
            default: false,
        },
    };

    const emits = ['update:modelValue'];

    return { props, emits };
}

type AnyType =
    | unknown
    | string
    | number
    | Record<string, unknown>
    | Record<string, unknown>[];

interface TypeFieldProps {
    originalValue: AnyType;
    modelValue: AnyType;
}
export function useTypeField(
    props: TypeFieldProps,
    emit: (event: string, value: AnyType) => void,
) {
    const model = computed({
        get() {
            return props.modelValue;
        },
        set(value) {
            emit('update:modelValue', value);
        },
    });

    return { model };
}

useTypeField.emits = ['update:modelValue'];

useTypeField.props = {
    originalValue: {
        type: [String, Number, Object, Array],
        default: null,
    },
    modelValue: {
        type: [String, Number, Object, Array, Blob],
        default: null,
    },
    readonly: {
        type: Boolean,
        default: false,
    },
};
