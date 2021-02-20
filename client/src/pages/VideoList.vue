<template>
  <q-page class="row items-center q-px-lg">
    
    <q-table 
      class="full-width"
      :columns='columns' :rows='rows'
    >
      <template #top-right>
        <q-btn @click="dialog = true" >{{$t('addNew')}}</q-btn>
      </template>
    </q-table>

    <q-dialog v-model="dialog">
      <q-card class="full-width" style='max-width:500px' >
        <q-card-section>
          <q-file 
          accept='.mp4'
          filled bottom-slots v-model="file" label="Label" counter>
          <template v-slot:prepend>
            <q-icon name="cloud_upload" @click.stop />
          </template>
          <template v-slot:append>
            <q-icon name="close" @click.stop="file = null" class="cursor-pointer" />
          </template>

          <template v-slot:hint>
            Field hint
          </template>
        </q-file>
        </q-card-section>
        <q-card-actions>
          <q-btn @click="addVideo" >{{$t("upload")}}</q-btn>
          <q-btn @click="dialog = false" >{{$t("cancel")}}</q-btn>
        </q-card-actions>

      </q-card>
    </q-dialog>
  </q-page>
</template>

<script lang="ts">
import { defineComponent, reactive, ref } from 'vue';

import { useI18n } from 'vue-i18n'
type VideoRow = {
  name: string
  path: string;
}
export default defineComponent({
  name: 'PageIndex',
  components: { },
  setup() {
    const tm = useI18n();

    const rows = reactive<VideoRow[]>([]);
    const dialog = ref(false);
    const file = ref<File>();

    const columns = [
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
      ];

    const setVideos = () => {
      for (let i = 0; i < 3; i++) {
        rows.push({
          name: `video-${i}`,
          path: `/path/${i}`
        })
      }
    }

    setVideos();

    const addVideo = () => {
      rows.push({
        name: file.value?.name || tm.t('undefined'),
        path: `path/${file.value?.name || '' }`
      })

      dialog.value = false
    }
    
    return {
      file,
      rows,
      columns,
      dialog,
      addVideo
    };
  }
});
</script>
