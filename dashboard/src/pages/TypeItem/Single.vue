<template>
    <q-page :style-fn="pageStyle">
        <q-toolbar class="bg-white border-grey-4 border-b">
            <q-toolbar-title>
                {{ title }}
            </q-toolbar-title>

            <q-btn
                :loading="loading"
                color="primary"
                flat
                style="margin-right: 16px"
                @click="cancel"
            >
                {{ $t('cancel') }}
            </q-btn>

            <q-btn
                :loading="loading"
                color="primary"
                style="margin-right: 16px"
                @click="save"
            >
                {{ $t('save') }}
            </q-btn>

            <div style="width: 300px" class="q-pa-sm">
                <ys-select-visibilities
                    v-model="item.visibilityId"
                    filled
                    dense
                    emit-value
                    map-options
                />
            </div>
        </q-toolbar>

        <div class="row" style="height: calc(100% - 57px)">
            <div class="col-9 q-pa-md bg-white">
                <single-field
                    v-for="(field, index) in bodyFields"
                    :key="index"
                    v-model="item[field.name]"
                    :field="field"
                    class="q-mb-md"
                />
            </div>

            <div class="col full-height q-pa-md border-l border-grey-4">
                <single-field
                    v-for="(field, index) in rightFields"
                    :key="index"
                    v-model="item[field.name]"
                    :field="field"
                    class="q-mb-md"
                />
            </div>
        </div>
    </q-page>
</template>

<script lang="ts">
import { defineComponent, defineAsyncComponent, ref, computed } from 'vue';
import { useI18n } from 'vue-i18n';
import { useRouter } from 'vue-router';

import {
    TypeField,
    Type,
    findType,
    fetchTypeFields,
} from '../Type/compositions';

import { findTypeItem, createTypeItem } from './compositions';

export default defineComponent({
    components: {
        SingleField: defineAsyncComponent(() => import('./SingleField.vue')),
    },
    props: {
        typeId: {
            type: [Number, String],
            required: true,
        },
        itemId: {
            type: [Number, String],
            default: null,
        },
    },
    setup(props) {
        const tm = useI18n();
        const router = useRouter();

        const loading = ref(false);
        const type = ref<Type>();
        const fields = ref<TypeField[]>();
        const item = ref({});

        const title = computed(() => {
            if (props.itemId) {
                return tm.t('edit', [`#${props.itemId}`]);
            }
            return tm.t('addNew');
        });

        const rightFields = computed(() =>
            fields.value?.filter((f) => f.options.position === 'right-sidebar'),
        );

        const bodyFields = computed(() =>
            fields.value?.filter(
                (f) => !f.options.position || f.options.position === 'body',
            ),
        );

        async function setType() {
            type.value = await findType(Number(props.typeId));

            const { data } = await fetchTypeFields(Number(props.typeId));

            fields.value = data;
        }

        async function setTypeItem() {
            item.value = await findTypeItem(
                Number(props.typeId),
                Number(props.itemId),
            );
        }

        void setType();

        if (props.itemId) {
            void setTypeItem();
        }

        function cancel() {
            return router.go(-1);
        }

        async function save() {
            await createTypeItem(Number(props.typeId), item.value);
        }

        function pageStyle(offset: number) {
            return {
                height: offset ? `calc(100vh - ${offset}px)` : '100vh',
            };
        }

        return {
            title,
            loading,
            fields,
            rightFields,
            bodyFields,
            item,

            save,
            cancel,
            pageStyle,
        };
    },
});
</script>
