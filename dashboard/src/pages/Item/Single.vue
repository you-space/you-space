<template>
    <q-page class="item-page">
        <q-toolbar class="bg-white border-grey-4 border-b">
            <q-toolbar-title>
                {{ `${$t('edit')} #${item.id || ''}` }}
            </q-toolbar-title>

            <q-btn
                :loading="saving || loading"
                color="primary"
                flat
                style="margin-right: 16px"
                @click="load"
            >
                {{ $t('cancel') }}
            </q-btn>

            <q-btn
                :loading="saving || loading"
                color="primary"
                style="margin-right: 16px"
                @click="save"
            >
                {{ $t('save') }}
            </q-btn>

            <div style="width: 300px" class="q-pa-sm">
                <q-select
                    v-model="item.visibilityId"
                    v-bind="autocomplete.props"
                    emit-value
                    outlined
                    dense
                    :label="$t('visibility')"
                />
            </div>
        </q-toolbar>

        <div class="row items-stretch item-page-content">
            <div class="col-9 q-pa-md full-height overflow-auto">
                <div class="row">
                    <div
                        v-for="(field, index) in fields"
                        :key="index"
                        :class="[
                            getColunmClass(field),
                            index > 0 ? 'q-mt-md' : '',
                        ]"
                    >
                        <type-field
                            v-model="item[field.name]"
                            :original-value="item[`original:${field.name}`]"
                            :field="field"
                            :loading="loading"
                        />
                    </div>
                </div>
            </div>

            <q-card
                flat
                class="col-3 full-height overflow-auto border-l border-grey-4"
            >
                <div class="row">
                    <div
                        v-for="(field, index) in sidebarFields"
                        :key="index"
                        :class="['col-12', 'border-b border-grey-4']"
                    >
                        <type-field
                            v-model="item[field.name]"
                            :original-value="item[`original:${field.name}`]"
                            :field="field"
                            :loading="loading"
                            is-sidebar
                        />
                    </div>
                </div>
            </q-card>
        </div>
    </q-page>
</template>
<script lang="ts">
import lodash from 'lodash';
import { defineComponent, ref, computed, defineAsyncComponent } from 'vue';

import { findItem, Item, saveItem, saveItemFiles } from './compositions';

import {
    findItemType,
    ItemType,
    TypeField,
} from 'src/pages/ItemType/compositions';

import { createVisibilityAutocomplete } from 'src/pages/Visilibilty/compositions';
import { api } from 'src/boot/axios';

export default defineComponent({
    components: {
        TypeField: defineAsyncComponent(() => import('./TypeField/Index.vue')),
    },
    props: {
        type: {
            type: String,
            required: true,
        },
        id: {
            type: String,
            required: true,
        },
    },
    setup(props) {
        const item = ref<Partial<Item>>({});
        const itemType = ref<Partial<ItemType>>({});
        const typeFields = ref<TypeField[]>([]);
        const autocomplete = createVisibilityAutocomplete();
        const loading = ref(false);
        const saving = ref(false);

        const fields = computed(() => {
            const fields = typeFields.value.filter(
                (f) => !f.input || f.input.position !== 'sidebar',
            );

            return lodash.orderBy(fields, (i) => i.input?.order);
        });

        const sidebarFields = computed(() => {
            const fields = typeFields.value.filter(
                (f) => f.input && f.input.position === 'sidebar',
            );

            return lodash.orderBy(fields, (i) => i.input?.order);
        });

        async function setType() {
            itemType.value = await findItemType(props.type);
        }

        async function setTypeFields() {
            const { data } = await api.get(`item-types/${props.type}/fields`);

            typeFields.value = data;
        }

        async function setItem() {
            item.value = await findItem(props.id, {
                showOriginals: true,
                serialize: true,
            });
        }

        async function load() {
            try {
                loading.value = true;
                await setType();
                await setTypeFields();
                await setItem();

                setTimeout(() => (loading.value = false), 800);
            } catch (error) {
                loading.value = false;
                throw new Error(error);
            }
        }

        void load();

        function getColunmClass(field: TypeField) {
            if (!field.input?.cols) {
                return 'col-12';
            }

            if (typeof field.input.cols === 'number') {
                return `col-${field.input.cols}`;
            }

            return Object.entries(field.input.cols).map(
                ([key, value]) => `col-${key}-${String(value)}`,
            );
        }

        async function save() {
            try {
                saving.value = true;

                const editableFields = typeFields.value.filter(
                    (f) => f.type === 'editable',
                );

                const itemFiles = editableFields
                    .filter((f) =>
                        ['image', 'video'].includes(f.input?.type || ''),
                    )
                    .reduce(
                        (all, f) => ({
                            ...all,
                            [f.name]: item.value[f.name],
                        }),
                        {},
                    );

                const itemInputs = editableFields
                    .filter(
                        (f) =>
                            !['image', 'video'].includes(f.input?.type || ''),
                    )
                    .reduce(
                        (all, f) => ({
                            ...all,
                            [f.name]: item.value[f.name],
                        }),
                        {},
                    );

                await saveItem(itemInputs, item.value.id);

                if (item.value.id) {
                    await saveItemFiles(itemFiles, item.value.id);
                }

                setTimeout(() => {
                    saving.value = false;
                    void load();
                }, 800);
            } catch (error) {
                saving.value = false;
            }
        }

        return {
            item,
            itemType,
            typeFields,
            fields,
            sidebarFields,
            loading,
            saving,

            autocomplete,
            getColunmClass,

            load,
            save,
        };
    },
});
</script>

<style lang="scss">
.item-page {
    height: calc(100vh - 38px - 51px);

    .item-page-content {
        height: calc(100% - 57px);
    }
}
</style>
