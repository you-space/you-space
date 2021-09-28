<template>
    <q-input v-bind="$attrs">
        <template v-for="(_, name) in $slots" #[name]="props">
            <slot :name="name" v-bind="props" />
        </template>
    </q-input>
</template>
