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
import { useSpace } from 'src/boot/space';
import { defineComponent, ref } from 'vue';

export default defineComponent({
    setup() {
        const loading = ref(false);
        const space = useSpace();

        const site = ref({
            name: '',
        });

        async function setSite() {
            const meta = await space.emit('metas:getAll', 'site:*');

            console.log(meta);
        }

        void setSite();

        function submit() {}

        return {
            loading,
            site,

            submit,
        };
    },
});
</script>
