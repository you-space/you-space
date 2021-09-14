<template>
    <q-select
        :options="options"
        v-bind="$attrs"
        option-value="id"
        option-label="name"
        :label="$t('visibility')"
    />
</template>
<script lang="ts">
import { fetchVisibilities } from 'src/pages/Visilibilty/compositions';
import { Visibility } from 'src/types';
import { defineComponent, ref } from 'vue';

export default defineComponent({
    setup() {
        const options = ref<Visibility[]>([]);

        async function setOptions() {
            options.value = await fetchVisibilities();
        }

        void setOptions();

        return {
            options,
        };
    },
});
</script>
