<template>
    <q-table
        v-bind="$attrs"
        :no-data-label="$t('noData')"
        :rows-per-page-options="[20, 50, 100]"
    >
        <template v-for="(_, name) in $slots" #[name]="props">
            <slot :name="name" v-bind="props" />
        </template>
    </q-table>
</template>
