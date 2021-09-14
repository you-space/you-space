<template>
    <q-page v-if="type" padding>
        <q-card>
            <div class="row">
                <q-card-section class="col-5 border-r border-grey-4">
                    <q-input
                        v-model="type.name"
                        class="q-mb-md"
                        filled
                        :label="$t('name')"
                    />
                    <ys-object
                        v-model="type.options"
                        :label="$tc('option', 2)"
                        :initial-value="type.options"
                    />
                    <q-btn
                        :label="$t('save')"
                        class="full-width q-mt-md"
                        color="primary"
                        @click="save"
                    />
                </q-card-section>
                <q-card-section class="col-7">
                    <single-field :type-id="id" />
                </q-card-section>
            </div>
        </q-card>
    </q-page>
</template>
<script lang="ts">
import { useEvents } from 'src/boot/events';
import { defineComponent, ref, defineAsyncComponent } from 'vue';
import { Type, findType, updateType } from './compositions';

export default defineComponent({
    components: {
        SingleField: defineAsyncComponent(() => import('./SingleField.vue')),
    },
    props: {
        id: {
            type: [Number, String],
            required: true,
        },
    },
    setup(props) {
        const type = ref<Type>();
        const tab = ref('fields');
        const events = useEvents();

        async function setType() {
            type.value = await findType(Number(props.id));
        }

        async function save() {
            if (!type.value) return;

            await updateType(Number(props.id), type.value);

            await setType();

            events.notifyAll('menu:update');
        }

        void setType();

        return {
            tab,
            type,

            save,
        };
    },
});
</script>
