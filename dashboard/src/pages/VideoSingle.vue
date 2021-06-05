<template>
    <q-page padding>
        <div class="row full-width">
            <div class="col-6 q-pa-md">
                <div class="flex items-start">
                    <q-item class="q-pl-none">
                        <q-item-section>
                            <h1 class="text-h5 text-bold q-my-none">
                                {{ $t('videoDetails') }}
                            </h1>
                        </q-item-section>
                    </q-item>
                    <q-item class="text-warning">
                        <q-item-section avatar>
                            <q-icon name="warning" label="test" />
                        </q-item-section>
                        <q-item-section>
                            <q-item-label>{{
                                $t('changesHereNotModifyOriginSource')
                            }}</q-item-label>
                        </q-item-section>
                    </q-item>
                </div>
                <q-input
                    v-model="video.title"
                    class="q-mb-md"
                    :label="$t('title')"
                />
                <q-input
                    v-model="video.description"
                    type="textarea"
                    :label="$t('description')"
                />
                <h2 class="text-h6 text-bold">{{ $t('thumbnail') }}</h2>
                <div class="row q-gutter-sm">
                    <div
                        class="col-4 relative-position current-thumbnail-container"
                    >
                        <y-img-or-icon
                            :src="currentThumbnailSrc"
                            width="100%"
                            height="140px"
                            :caption="$t('currentThumbnail')"
                        />
                        <div
                            class="absolute-full upload-button flex items-center bg-grey-4 justify-center"
                            @click="uploadNewThumbnail"
                        >
                            <q-icon size="xl" name="upload" />
                            {{ $t('uploadNew') }}
                        </div>
                        <q-file
                            ref="filePicker"
                            v-model="newThumbnailFile"
                            class="hidden"
                            accept=".jpg,.png"
                        />
                    </div>
                    <div class="col-4">
                        <y-img-or-icon
                            :src="video.originThumbnail"
                            width="100%"
                            height="140px"
                            :caption="$t('originThumbnail')"
                        />
                    </div>
                </div>
            </div>
            <div class="col-4 offset-1 q-pa-md">
                <div class="flex justify-end q-mb-md">
                    <q-btn
                        color="primary"
                        flat
                        style="width: 160px"
                        class="q-mr-sm"
                        :disable="!haveChanges"
                        @click="reset"
                    >
                        {{ $t('discardChanges') }}
                    </q-btn>
                    <q-btn
                        color="primary"
                        style="width: 160px"
                        :disable="!haveChanges"
                        @click="saveVideo"
                    >
                        {{ $t('save') }}
                    </q-btn>
                </div>

                <div style="height: 270px" class="q-mb-md">
                    <y-video :src="video.src" />
                </div>

                <q-list class="q-mb-md">
                    <q-item class="q-pl-none">
                        <q-item-section>
                            <q-item-label overline>{{
                                $t('videoLink')
                            }}</q-item-label>
                            <q-item-label>
                                <a
                                    :href="video.link"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                >
                                    {{ video.link }}
                                </a>
                            </q-item-label>
                        </q-item-section>
                        <q-item-section side>
                            <q-icon
                                name="launch"
                                class="cursor-pointer"
                                @click="openURL(video.link)"
                            />
                        </q-item-section>
                    </q-item>
                    <q-separator></q-separator>
                    <q-item class="q-pl-none">
                        <q-item-section>
                            <q-item-label overline>{{
                                $t('originLink')
                            }}</q-item-label>
                            <q-item-label>
                                <a
                                    :href="video.originLink"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                >
                                    {{ video.originLink }}
                                </a>
                            </q-item-label>
                        </q-item-section>
                        <q-item-section side>
                            <q-icon
                                name="launch"
                                class="cursor-pointer"
                                @click="openURL(video.originLink)"
                            />
                        </q-item-section>
                    </q-item>
                </q-list>

                <q-select
                    v-model="video.visibilityId"
                    :options="visibilities"
                    option-label="name"
                    option-value="id"
                    :label="$t('visibility')"
                    filled
                    map-options
                    emit-value
                >
                    <template #prepend>
                        <q-icon name="visibility" class="cursor-pointer" />
                    </template>
                </q-select>
            </div>
        </div>
    </q-page>
</template>

<script lang="ts">
import lodash from 'lodash';
import { api } from 'src/boot/axios';
import { Video } from 'src/types/video';
import { defineComponent, ref, computed, watch } from 'vue';
import { openURL, QFile } from 'quasar';
import { Visibility } from 'src/types';
import { getBase64 } from 'src/functionts';

export default defineComponent({
    name: 'Video',
    props: {
        videoId: {
            type: String,
            required: true,
        },
    },
    setup(props) {
        const visibilities = ref<Visibility[]>([]);

        let videoOriginalData: Partial<Video> = {};

        const video = ref({
            title: '',
            type: '',
            thumbnailSrc: '',
            description: '',
        });

        const newThumbnailFile = ref<File | null>(null);
        const newThumbnailBase64 = ref<string | null>(null);
        const filePicker = ref<QFile | null>(null);

        const haveChanges = computed(() => {
            if (newThumbnailFile.value) {
                return true;
            }
            return !lodash.isEqual(videoOriginalData, video.value);
        });

        const currentThumbnailSrc = computed(() => {
            if (newThumbnailBase64.value) {
                return newThumbnailBase64.value;
            }

            return video.value.thumbnailSrc;
        });

        async function setVisibilities() {
            const { data } = await api.get<Visibility[]>('admin/visibilities');
            visibilities.value = data;
        }

        void setVisibilities();

        const setVideo = async () => {
            // const { data } = await api.get<Video>(`/videos/${props.videoId}`);
            // videoOriginalData = JSON.parse(JSON.stringify(data));
            // video.value = data;
        };

        void setVideo();

        function uploadNewThumbnail() {
            if (!filePicker.value) {
                return;
            }

            filePicker.value.pickFiles();
        }

        async function reset() {
            newThumbnailFile.value = null;
            newThumbnailBase64.value = null;

            await setVideo();
        }

        async function saveVideo() {
            // if (!video.value) {
            //     return;
            // }
            // const formData = new FormData();
            // formData.append('title', video.value.title);
            // formData.append('description', video.value.description);
            // formData.append('visibilityId', video.value.visibilityId);
            // if (newThumbnailFile.value) {
            //     formData.append('thumbnail', newThumbnailFile.value);
            // }
            // await api.patch(`admin/videos/${props.videoId}`, formData);
            // await reset();
        }

        watch(
            () => newThumbnailFile.value,
            async (value) => {
                if (!value) {
                    newThumbnailBase64.value = null;
                    return;
                }

                newThumbnailBase64.value = await getBase64(value);
            },
        );

        return {
            video,
            openURL,
            visibilities,
            haveChanges,
            saveVideo,
            uploadNewThumbnail,
            filePicker,
            newThumbnailFile,
            currentThumbnailSrc,
            reset,
        };
    },
});
</script>
<style lang="scss">
.current-thumbnail-container {
    .upload-button {
        opacity: 0;
        transition: opacity var(--q-transition-duration);
        cursor: pointer;
    }

    &:hover {
        .upload-button {
            opacity: 1;
        }
    }
}
</style>
