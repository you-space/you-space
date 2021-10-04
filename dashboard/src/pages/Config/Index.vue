<template>
    <y-page padding>
        <div class="text-h4 text-bold q-mb-md">Configurations</div>

        <y-form class="row wrap" @submit="submit">
            <div class="col-12 q-mb-md">
                <y-input
                    v-model="site.name"
                    :loading="loading"
                    style="max-width: 500px"
                    label="Site name"
                    filled
                />
            </div>
            <!-- 
            <div class="col-12 q-mb-md">
                <y-toggle
                    v-model="config.activePages"
                    :disable="loading"
                    val="space-jobs"
                    label="Enable jobs page"
                />
            </div>

            <div class="col-12 q-mb-md">
                <y-toggle
                    v-model="config.activePages"
                    :disable="loading"
                    val="space-types"
                    label="Enable Types page"
                />
            </div>

            <div class="col-12 q-mb-md">
                <y-toggle
                    v-model="config.activePages"
                    :disable="loading"
                    val="space-items-raw"
                    label="Enable Items raw page"
                /> -->
            <!-- </div> -->

            <div class="col-12 q-mb-md">
                <y-btn type="submit" label="Submit" />
            </div>
        </y-form>
    </y-page>
</template>
<script lang="ts">
import { useStore } from 'src/store';
import { defineComponent, ref } from 'vue';
import { findSiteInfo, updateSiteInfo } from './compositions';

export default defineComponent({
    setup() {
        const loading = ref(false);
        const store = useStore();

        const site = ref({
            name: '',
        });

        async function setSite() {
            site.value = await findSiteInfo();
        }

        void setSite();

        async function submit() {
            await updateSiteInfo(site.value);
            await setSite();
            await store.dispatch('app/setName');
        }

        return {
            loading,
            site,

            submit,
        };
    },
});
</script>
