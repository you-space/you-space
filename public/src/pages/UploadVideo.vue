<template>
  <q-dialog v-model="dialog">
    <q-card
      class="full-width flex"
      style="max-width:500px"
    >
      <q-card-section class="full-width">
        <q-input
          v-model="name"
          :label="$t('name')"
          class="q-mb-sm"
        />

        <q-file 
          v-model="video"
          accept=".mp4"
          filled
          bottom-slots
          :label="$t('video')"
          counter
          style="width:100%"
        >
          <template #prepend>
            <q-icon
              name="smart_display"
              @click.stop
            />
          </template>
          <template #append>
            <q-icon
              v-if="video"
              name="close"
              class="cursor-pointer"
              @click.stop="video = null"
            />
          </template>
        </q-file>
        
        <q-file 
          v-model="thumbnail"
          accept=".png,.jpg"
          filled
          bottom-slots
          :label="$t('thumbnail')"
          counter
          style="width:100%"
        >
          <template #prepend>
            <q-icon
              name="insert_photo"
              @click.stop
            />
          </template>
          <template #append>
            <q-icon
              v-if="thumbnail"
              name="close"
              class="cursor-pointer"
              @click.stop="thumbnail = null"
            />
          </template>
        </q-file>
      </q-card-section>

      <q-card-section class="text-right full-width">
        <q-btn
          :disabled="!name || !video"
          color="primary" 
          @click="uploadVideo"
        >
          {{ $t("upload") }}
        </q-btn>
        <q-btn @click="dialog = false">
          {{ $t("cancel") }}
        </q-btn>
      </q-card-section>
    </q-card>
  </q-dialog>
</template>

<script lang='ts' >
import { api } from 'src/boot/axios';
import { defineComponent, ref, computed } from 'vue';
export default defineComponent({
    props: {
        modelValue: {
            type: Boolean,
            default: false,
        }
    },
    emits: ['update:modelValue', 'save'],
    setup(props, { emit }){
        
        const video = ref<File>();
        const thumbnail = ref<File>();

        const name = ref('');
        const dialog = computed({
            get(){
                return props.modelValue;
            },
            set(value){
                emit('update:modelValue', value);
            }
        });

        const uploadVideo = async () => {

            if (!video.value) {
                return;
            }

            const formData = new FormData();

            formData.append('name', name.value);
            formData.append('video', video.value);

            if (thumbnail.value) {
                formData.append('thumbnail', thumbnail.value);
            }

            await api.post('admin/videos', formData);

            emit('save');

            dialog.value = false;
        };

        return {
            uploadVideo,
            dialog,
            video,
            thumbnail,
            name
        };
    }
});
</script>

<style>

</style>