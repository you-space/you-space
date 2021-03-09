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
        <q-select
          v-model="type"
          :label="$t('type')"
          class="q-mb-sm"
          :options="types"
        />
        <template v-if="type === 'you-tube'">
          <q-input            
            v-model="config.apiToken"
            :label="$t('apiToken')"
          />
          
          <q-input            
            v-model="config.channelId"
            :label="$t('channelId')"
          />
        </template>
      </q-card-section>

      <q-card-section class="text-right full-width">
        <q-btn
          :disabled="!name || !type"
          color="primary"
          class="q-mr-sm" 
          @click="saveOrigin"
        >
          {{ $t("save") }}
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
        const name = ref('');
        const type = ref('');
        const config = ref({

        });
        
        const types = [
            'you-tube',
            'twitch'
        ];

        const dialog = computed({
            get(){
                return props.modelValue;
            },
            set(value){
                emit('update:modelValue', value);
            }
        });

        const saveOrigin = async () => {

            await api.post('admin/origins', {
                name: name.value,
                type: type.value,
                config: config.value
            });

            emit('save');

            dialog.value = false;
        };

        return {
            saveOrigin,
            dialog,
            name,
            type,
            types,
            config
        };
    }
});
</script>

<style>

</style>