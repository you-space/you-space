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

        <div class="row relative" style="height: calc(100% - 57px)">
            <q-inner-loading v-if="loading" :showing="true">
                <q-spinner-gears size="50px" color="primary" />
            </q-inner-loading>

            <template v-if="!loading">
                <div class="col-9 q-pa-md bg-white overflow-auto full-height">
                    <single-field
                        v-for="(field, index) in bodyFields"
                        :key="index"
                        v-model="item[field.name]"
                        :field="field"
                        class="q-mb-md"
                    />
                </div>

                <div
                    :class="[
                        'col',
                        'full-height',
                        'q-pa-md',
                        'border-l border-grey-4',
                        'overflow-auto',
                        'full-height',
                    ]"
                >
                    <div class="q-gutter-y-md">
                        <single-field
                            v-for="(field, index) in rightFields"
                            :key="index"
                            v-model="item[field.name]"
                            :field="field"
                        />
                    </div>
                </div>
            </template>
        </div>
    </q-page>
</template>

<script lang="ts">
import lodash from 'lodash';

import {
    defineComponent,
    defineAsyncComponent,
    ref,
    computed,
    watch,
} from 'vue';
import { useI18n } from 'vue-i18n';
import { useRouter } from 'vue-router';

import {
    TypeField,
    Type,
    findType,
    fetchTypeFields,
} from '../Type/compositions';

import {
    findTypeItem,
    createTypeItem,
    updateTypeItem,
    uploadTypeItemFile,
} from './compositions';
import { provideFilesToUpload } from './compositions/use-item-files';

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
        const fields = ref<TypeField[]>([]);
        const item = ref({});
        const itemFiles = ref({});

        provideFilesToUpload(itemFiles);

        const title = computed(() => {
            if (props.itemId) {
                return tm.t('edit', [`#${props.itemId}`]);
            }
            return tm.t('addNew');
        });

        const rightFields = computed(() =>
            fields.value
                .filter(
                    (f) =>
                        props.itemId || ['editable', 'file'].includes(f.type),
                )
                .filter(
                    (f) =>
                        lodash.get(f, 'options.single.position') === 'sidebar',
                ),
        );

        const bodyFields = computed(() =>
            fields.value
                .filter(
                    (f) =>
                        props.itemId || ['editable', 'file'].includes(f.type),
                )
                .filter(
                    (f) =>
                        lodash.get(f, 'options.single.position') !== 'sidebar',
                ),
        );

        async function setType() {
            type.value = await findType(Number(props.typeId));

            const { data } = await fetchTypeFields(Number(props.typeId));

            fields.value = data;
        }

        async function setTypeItem() {
            if (!props.itemId) return;

            loading.value = true;

            item.value = await findTypeItem(
                Number(props.typeId),
                Number(props.itemId),
            );

            itemFiles.value = {};

            setTimeout(() => (loading.value = false), 800);
        }

        void setType();

        watch(() => props.itemId, setTypeItem, {
            immediate: true,
        });

        function cancel() {
            return router.go(-1);
        }

        async function create() {
            const createItem = await createTypeItem(
                Number(props.typeId),
                item.value,
            );

            if (Object.keys(itemFiles.value).length) {
                await uploadTypeItemFile(
                    Number(props.typeId),
                    Number(createItem.id),
                    itemFiles.value,
                );
            }

            return router.push({
                name: 'type-item-single',
                params: {
                    typeId: props.typeId,
                    itemId: createItem.id,
                },
            });
        }

        async function update() {
            await updateTypeItem(
                Number(props.typeId),
                Number(props.itemId),
                item.value,
            );

            if (Object.keys(itemFiles.value).length) {
                await uploadTypeItemFile(
                    Number(props.typeId),
                    Number(props.itemId),
                    itemFiles.value,
                );
            }

            await setTypeItem();
        }

        async function save() {
            if (!props.itemId) {
                return create();
            }

            return update();
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
            itemFiles,

            save,
            cancel,
            pageStyle,
        };
    },
});
</script>
