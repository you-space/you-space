<template>
    <q-page>
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

        <q-card class="q-mx-auto q-mt-md" style="width: 500px">
            <q-card-section>
                <template v-for="(field, index) in fields" :key="index">
                    <q-input
                        v-model="item[field.name]"
                        filled
                        class="q-mb-md"
                        :label="field.name"
                    />
                </template>
            </q-card-section>
        </q-card>
    </q-page>
</template>

<script lang="ts">
import { defineComponent, ref, computed } from 'vue';
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

        async function setType() {
            type.value = await findType(Number(props.typeId));

            const { data } = await fetchTypeFields(Number(props.typeId));

            fields.value = data.filter((f) => f.type === 'editable');
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

        return {
            title,
            loading,
            fields,
            item,

            save,
            cancel,
        };
    },
});
</script>
