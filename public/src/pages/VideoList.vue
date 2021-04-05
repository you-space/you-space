<template>
    <q-page class="row items-start q-pa-lg">
        <q-table
            v-model:pagination="pagination"
            v-model:selected="selected"
            :loading="loading"
            class="full-width"
            :columns="columns"
            :rows="rows"
            :rows-per-page-options="[0]"
            row-key="id"
            selection="multiple"
            @request="onRequestTable"
        >
            <template #top>
                <div class="row full-width">
                    <div class="col-3 q-pr-md">
                        <q-input
                            v-model="filters.search"
                            :label="$t('search')"
                        ></q-input>
                    </div>
                    <div class="col-3 q-pr-md">
                        <q-select
                            v-model="filters.visibility"
                            :label="$t('visibility')"
                            :options="visibilities"
                            option-value="name"
                            option-label="name"
                            map-options
                            emit-value
                            multiple
                            clearable
                        />
                    </div>
                    <div class="col-3 q-pr-md">
                        <q-select
                            v-model="filters.originId"
                            :label="$t('origin')"
                            :options="origins"
                            option-value="id"
                            option-label="name"
                            map-options
                            emit-value
                            multiple
                            clearable
                        />
                    </div>

                    <div class="col-3 text-right">
                        <q-btn @click="dialog = true">
                            {{ $t('addNew') }}
                        </q-btn>
                    </div>
                </div>
            </template>

            <template #body-cell-thumbnail="props">
                <q-td :props="props">
                    <q-img
                        v-if="props.row.thumbnailSrc"
                        :src="props.row.thumbnailSrc"
                        width="100px"
                        height="50px"
                    />
                    <div
                        v-else
                        class="full-width text-center bg-grey flex items-center justify-center"
                        style="width: 100px; height: 50px"
                    >
                        <q-icon size="md" name="insert_photo" />
                    </div>
                </q-td>
            </template>

            <template #body-cell-actions="props">
                <q-td :props="props">
                    <q-btn
                        class="q-mr-sm"
                        icon="visibility"
                        size="xs"
                        flat
                        round
                        :to="getVideoPath(props.row)"
                    />
                    <q-btn
                        icon="delete"
                        size="xs"
                        flat
                        round
                        @click="deleteVideo(props.row)"
                    />
                </q-td>
            </template>
        </q-table>

        <video-upload-video v-model="dialog" @save="onRequestTable" />
    </q-page>
</template>

<script lang="ts">
import { pickBy, identity } from 'lodash';
import { defineComponent, ref, defineAsyncComponent, watch } from 'vue';
import { useI18n } from 'vue-i18n';

import { api } from 'boot/axios';
import { Video } from 'src/types/video';
import { getOrigins, getVideoPath, getVisibilities } from 'src/functionts';
import { Origin, Visibility } from 'src/types';

interface VideosResponse {
    data: Video[];
    meta: {
        total: number;
    };
}

interface Filters {
    visibility: string[] | null;
    originId: number[] | null;
}

export default defineComponent({
    name: 'AdminVideoList',
    components: {
        VideoUploadVideo: defineAsyncComponent(
            () => import('./UploadVideo.vue'),
        ),
    },
    setup() {
        const tm = useI18n();

        const rows = ref<Video[]>([]);
        const selected = ref<Video[]>([]);

        const visibilities = ref<Visibility[]>([]);
        const origins = ref<Origin[]>([]);

        const showFilters = ref(false);
        const dialog = ref(false);
        const loading = ref(false);

        const filters = ref<Filters>({
            visibility: null,
            originId: null,
        });

        const pagination = ref({
            sortBy: 'desc',
            descending: false,
            page: 1,
            rowsPerPage: 20,
            rowsNumber: 10,
        });

        const columns = [
            {
                name: 'thumbnail',
                align: 'left',
                style: 'width:100px',
            },
            {
                label: tm.t('title'),
                name: 'title',
                field: 'title',
                align: 'left',
            },
            {
                label: tm.t('visibility'),
                name: 'visibility',
                field: (row: Video) => row.visibility.name,
                align: 'left',
            },
            {
                label: tm.t('origin'),
                name: 'origin',
                field: (row: Video) => row.origin.name,
                align: 'left',
            },
            {
                label: tm.t('view', 2),
                name: 'viewsCount',
                field: (row: Video) => tm.n(row.viewsCount),
                align: 'left',
            },
            { name: 'actions' },
        ];

        const getVideos = async (page = 1) => {
            const values = filters.value;
            const query = {
                ...filters.value,
                visibility: values.visibility ? values.visibility.join() : null,
                origin: values.originId ? values.originId.join() : null,
                page: String(page),
            };

            const { data } = await api.get<VideosResponse>('admin/videos', {
                params: new URLSearchParams(pickBy<any>(query, (k) => !!k)),
            });

            const videos = data.data;

            return {
                videos: videos,
                meta: data.meta,
            };
        };

        const onRequestTable = async (props: any = null) => {
            loading.value = true;
            let tablePagination = props ? props.pagination : pagination.value;

            const { page, rowsPerPage, sortBy, descending } = tablePagination;

            const { videos, meta } = await getVideos(page);

            rows.value = videos;
            pagination.value.rowsNumber = meta.total;

            pagination.value.page = page;
            pagination.value.rowsPerPage = rowsPerPage;
            pagination.value.sortBy = sortBy;
            pagination.value.descending = descending;

            setTimeout(() => (loading.value = false), 800);
        };

        async function reload() {
            const { videos, meta } = await getVideos(pagination.value.page);
            pagination.value.rowsNumber = meta.total;
            rows.value = videos;
        }

        async function setVisibilities() {
            visibilities.value = await getVisibilities();
        }

        async function setOrigins() {
            origins.value = await getOrigins();
        }

        void setVisibilities();
        void setOrigins();
        void reload();

        const deleteVideo = async (item: Video) => {
            await api.delete(`admin/videos/${item.id}`);
            await onRequestTable({ pagination: pagination.value });
        };

        watch(() => filters, reload, { deep: true });

        return {
            columns,
            rows,
            selected,
            visibilities,
            origins,
            loading,
            pagination,
            dialog,
            deleteVideo,
            onRequestTable,
            getVideoPath,
            showFilters,
            filters,
        };
    },
});
</script>
