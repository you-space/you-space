export function createTypeField(){
    const props = {
        currentValue: {
            type: [String, Number, Object, Array],
            default: null
        },
        originalValue: {
            type: [String, Number, Object, Array],
            default: null,
        },
        modelValue: {
            type: [String, Number, Object, Array],
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