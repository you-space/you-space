import { inject, provide, Ref } from 'vue';

export type FilesToUpload = Ref<Record<string, File>>;

const key = Symbol('item:files-to-upload');

export function provideFilesToUpload(value: FilesToUpload) {
    return provide(key, value);
}

export function useFilesToUpload() {
    return inject<FilesToUpload>(key);
}
