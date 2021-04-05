<template>
    <q-dialog v-model="dialog">
        <q-card class="full-width flex" style="max-width: 500px">
            <q-card-section class="full-width">
                <q-input
                    v-model="video.title"
                    :label="$t('title')"
                    class="q-mb-sm"
                />
                <q-input
                    v-model="video.description"
                    type="textarea"
                    :label="$t('description')"
                    class="q-mb-sm"
                />

                <q-file
                    v-model="video.file"
                    accept=".mp4"
                    filled
                    bottom-slots
                    :label="$t('video')"
                    counter
                    style="width: 100%"
                >
                    <template #prepend>
                        <q-icon name="smart_display" @click.stop />
                    </template>
                    <template #append>
                        <q-icon
                            v-if="video.file"
                            name="close"
                            class="cursor-pointer"
                            @click.stop="video.file = null"
                        />
                    </template>
                </q-file>

                <q-file
                    v-model="video.thumbnail"
                    accept=".png,.jpg"
                    filled
                    bottom-slots
                    :label="$t('thumbnail')"
                    counter
                    style="width: 100%"
                >
                    <template #prepend>
                        <q-icon name="insert_photo" @click.stop />
                    </template>
                    <template #append>
                        <q-icon
                            v-if="video.thumbnail"
                            name="close"
                            class="cursor-pointer"
                            @click.stop="video.thumbnail = null"
                        />
                    </template>
                </q-file>
            </q-card-section>

            <q-card-section class="text-right full-width">
                <q-btn color="primary" @click="uploadVideo">
                    {{ $t('upload') }}
                </q-btn>
                <q-btn @click="dialog = false">
                    {{ $t('cancel') }}
                </q-btn>
            </q-card-section>
        </q-card>
    </q-dialog>
</template>

<script lang="ts">
import { api } from 'src/boot/axios';
import { defineComponent, ref, computed } from 'vue';

interface Upload {
    title: string;
    description: string;
    file: File | null;
    thumbnail: File | null;
}

export default defineComponent({
    props: {
        modelValue: {
            type: Boolean,
            default: false,
        },
    },
    emits: ['update:modelValue', 'save'],
    setup(props, { emit }) {
        const video = ref<Upload>({
            title: '',
            description: '',
            file: null,
            thumbnail: null,
        });

        const dialog = computed({
            get() {
                return props.modelValue;
            },
            set(value) {
                emit('update:modelValue', value);
            },
        });

        const uploadVideo = async () => {
            if (!video.value) {
                return;
            }

            const formData = new FormData();

            formData.append('title', video.value.title);
            formData.append('description', video.value.description);
            formData.append('video', video.value.file || '');

            if (video.value.thumbnail) {
                formData.append('thumbnail', video.value.thumbnail);
            }

            await api.post('admin/videos', formData);

            emit('save');

            dialog.value = false;
        };

        return {
            uploadVideo,
            dialog,
            video,
        };
    },
});
</script>

<style></style>
