<template>
  <q-page class="row items-start q-pa-lg">
    <q-table 
      class="full-width"
      :columns="columns"
      :rows="rows"
      :rows-per-page-options="[10, 20, 0]"
    >
      <template #top-right>
        <q-btn @click="dialog = true">
          {{ $t('addNew') }}
        </q-btn>
      </template>
      
      <template #body-cell-thumbnail="props">
        <q-td :props="props">
          <q-img
            v-if="props.row.thumbSrc"
            :src="getVideoThumbnailPath(props.row)"
            width="100px"
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
      @save="setVideos"
    />
  </q-page>
</template>

<script lang="ts">
import { defineComponent, ref, onMounted, defineAsyncComponent } from 'vue';
import { useI18n } from 'vue-i18n';
import { useRouter } from 'vue-router';

import { getVideoThumbnailPath } from 'src/functionts';
import { api  } from 'boot/axios';
import { Video } from 'src/types/video';

export default defineComponent({
    name: 'PageIndex',
    components: {
        AdminVideoUploadVideo: defineAsyncComponent(() => import('./AdminUploadVideo.vue'))
    },
    setup() {
        const tm = useI18n();
        const router = useRouter();

        const rows = ref<Video[]>([]);
        const dialog = ref(false);

        const columns = [
            {
                label: tm.t('thumbnail'),
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
                label: tm.t('directory'),
                name: 'directory',
                field: 'path',
                align: 'left'
            },
            {
                name: 'actions', 
            },
        ];

        const setVideos = async () => {
            const { data } = await api.get<Video[]>('admin/videos');
            rows.value = data;
        };

        onMounted(setVideos);

        
    
        const viewVideo = async (item: Video) => {
            await router.push({
                name: 'admin-video',
                params: {
                    videoId: item.videoId,
                    originId: item.originId || 'main'
                }
            });
        };
    
        const deleteVideo = async (item: Video) => {
            await api.delete(`admin/videos/${item.videoId}`);
            await setVideos();
        };
    
        return {
            rows,
            columns,
            dialog,
            viewVideo,
            deleteVideo,
            setVideos,
            getVideoThumbnailPath
        };
    }
});
</script>
