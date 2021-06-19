<template>
    <q-page class="item-page">
        <q-toolbar class="bg-white border-grey-4 border-b">
            <q-toolbar-title>
                {{ `${$t('edit')} #${item.id || ''}` }}
            </q-toolbar-title>
            <q-btn color="primary" flat style="margin-right: 16px">
                {{ $t('cancel') }}
            </q-btn>
            <q-btn color="primary" style="margin-right: 16px">
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
                        <type-field v-model="item[field.name]" :field="field" />
                    </div>
                </div>
            </div>

            <q-card square falt class="col-3 q-pa-md overflow-y-auto">
                <div class="row">
                    <div
                        v-for="(field, index) in sidebarFields"
                        :key="index"
                        :class="[
                            getColunmClass(field),
                            index > 0 ? 'q-mt-md' : '',
                        ]"
                    >
                        <type-field v-model="item[field.name]" :field="field" />
                    </div>
                </div>
            </q-card>
        </div>
    </q-page>
</template>
<script lang="ts">
import { defineComponent, ref, computed, defineAsyncComponent } from 'vue';
import {
    findItem,
    findItemType,
    Item,
    ItemType,
    TypeField,
} from './compositions';
import { createVisibilityAutocomplete } from 'src/pages/Visilibilty/compositions';
import lodash from 'lodash';
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
            item.value = await findItem(props.type, props.id);
        }

        async function setData() {
            await setType();
            await setTypeFields();
            await setItem();
        }

        void setData();

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

        return {
            item,
            itemType,
            typeFields,
            fields,
            sidebarFields,

            autocomplete,
            getColunmClass,
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
