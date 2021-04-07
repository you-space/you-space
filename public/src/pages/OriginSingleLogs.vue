<template>
    <q-card class="full-height">
        <q-tabs v-model="tab" inline-label align="justify">
            <q-tab name="logs" :label="$t('logs')" />
            <q-tab name="errors" :label="$t('errors')" />
            <q-tab name="all" :label="$t('all')" />
        </q-tabs>

        <q-separator />

        <q-tab-panels v-model="tab" animated>
            <q-tab-panel name="logs"> logs </q-tab-panel>
            <q-tab-panel name="errors"> errors </q-tab-panel>
            <q-tab-panel name="all"> all </q-tab-panel>
        </q-tab-panels>
    </q-card>
</template>
<script>
import { ref } from 'vue';

export default {
    setup() {
        return { tab: ref('logs') };
    },
};
</script>
