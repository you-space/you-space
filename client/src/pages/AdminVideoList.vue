<template>
  <q-page class="row items-start q-pa-lg">
    <q-table
      v-model:pagination="pagination"
      :loading="loading"
      class="full-width"
      :columns="columns"
      :rows="rows"
      :rows-per-page-options="[0]"
      @request="onRequestTable"
    >
      <template #top-right>
        <q-btn @click="dialog = true">
          {{ $t('addNew') }}
        </q-btn>
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
            style="width:100px;height:50px"
          >
            <q-icon
              size="md"
              name="insert_photo"
            />
          </div>
        </q-td>
      </template>
     
      <template #body-cell-actions="props">
        <q-td :props="props">
          <q-icon
            class="q-mr-sm"
            name="visibility"
            @click="viewVideo(props.row)"
          />
          <q-icon
            name="delete"
            @click="deleteVideo(props.row)"
          />
        </q-td>
      </template>
    </q-table>
    
    <admin-video-upload-video
      v-model="dialog"
      @save="onRequestTable"
    />
  </q-page>
</template>

<script lang="ts">
import { defineComponent, ref, onMounted, defineAsyncComponent } from 'vue';
import { useI18n } from 'vue-i18n';
import { useRouter } from 'vue-router';

import { api  } from 'boot/axios';
import { Video } from 'src/types/video';
import { getImgSrc } from 'src/functionts';

interface VideosResponse {
  data: Video[]
  meta: any
}

export default defineComponent({
    name: 'AdminVideoList',
    components: {
        AdminVideoUploadVideo: defineAsyncComponent(() => import('./AdminUploadVideo.vue'))
    },
    setup() {
        const tm = useI18n();
        const router = useRouter();

        const rows = ref<Video[]>([]);
        const dialog = ref(false);

        const loading = ref(false);
        const pagination = ref({
            sortBy: 'desc',
            descending: false,
            page: 1,
            rowsPerPage: 20,
            rowsNumber: 10
        });

        const columns = [
            {
                name: 'thumbnail',
                align: 'left',
                style: 'width:100px'
            },
            {
                label: tm.t('name'),
                name: 'name',
                field: 'name',
                align: 'left'
            },
            {
                label: tm.t('visibility'),
                name: 'visibility',
                field: (row: Video) => row.visibility.name,
                align: 'left'
            },
            {
                label: tm.t('origin'),
                name: 'origin',
                field: (row: Video) => row.origin.name,
                align: 'left'
            },
            {
                label: tm.t('views'),
                name: 'viewsCount',
                field: 'viewsCount',
                align: 'left'
            },
            {
                name: 'actions', 
            },
        ];

        const getVideos = async (page = 1) => {
            const { data } = await api.get<VideosResponse>('admin/videos', {
                params: {
                    page
                }
            });
            
            const videos = await Promise.all(data.data.map(async v => ({
                ...v,
                thumbnailSrc: await getImgSrc(v)
            })));

            return {
                videos: videos,
                meta: data.meta
            };

        };

        const onRequestTable = async (props: any = null) => {
            loading.value = true;
            let tablePagination = props ? props.pagination : pagination.value;

            const {
                page, rowsPerPage, sortBy, descending 
            } = tablePagination;

            const { videos, meta } = await getVideos(page);
            
            rows.value = videos;
            pagination.value.rowsNumber = meta.total;

            pagination.value.page = page;
            pagination.value.rowsPerPage = rowsPerPage;
            pagination.value.sortBy = sortBy;
            pagination.value.descending = descending;

            setTimeout(() => loading.value = false, 800);
        };

        onMounted(async () => {
            const { videos, meta } = await getVideos();
            pagination.value.rowsNumber = meta.total;
            rows.value = videos;
        });

        
    
        const viewVideo = async (item: Video) => {
            await router.push({
                name: 'admin-video',
                params: {
                    videoId: item.id,
                    originId: item.originId || 'main'
                }
            });
        };
    
        const deleteVideo = async (item: Video) => {
            await api.delete(`admin/videos/${item.id}`);
            await onRequestTable({
                pagination: pagination.value 
            });
        };
    
        return {
            rows,
            columns,
            loading,
            pagination,
            dialog,
            viewVideo,
            deleteVideo,
            onRequestTable
        };
    }
});
</script>
