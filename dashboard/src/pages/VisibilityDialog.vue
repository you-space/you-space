<template>
    <q-dialog v-model="dialog">
        <q-card class="full-width flex" style="max-width: 500px">
            <q-card-section class="full-width">
                <q-input
                    v-model="visibility.name"
                    :label="$t('name')"
                    class="q-mb-sm"
                />
                <q-select
                    v-model="visibility.requiredPermissionIds"
                    :label="$tc('permission', 2)"
                    :options="permissions"
                    option-value="id"
                    option-label="name"
                    map-options
                    emit-value
                    multiple
                />
            </q-card-section>
            <q-card-section class="text-right full-width">
                <q-btn
                    :disabled="!visibility.name"
                    color="primary"
                    class="q-mr-sm"
                    @click="saveVisibility"
                >
                    {{ $t('save') }}
                </q-btn>
                <q-btn @click="dialog = false">
                    {{ $t('cancel') }}
                </q-btn>
            </q-card-section>
        </q-card>
    </q-dialog>
</template>
<script lang="ts">
import { api } from 'src/boot/axios';
import { Permission, Visibility } from 'src/types';
import { defineComponent, computed, ref, watch } from 'vue';

export default defineComponent({
    props: {
        modelValue: {
            type: Boolean,
            default: false,
        },
        visibilityId: {
            type: Number,
            default: null,
        },
    },
    emits: ['update:modelValue', 'save'],
    setup(props, { emit }) {
        const visibility = ref({
            name: '',
            requiredPermissionIds: [] as number[],
        });
        const permissions = ref<Permission[]>([]);
        const dialog = computed({
            get() {
                return props.modelValue;
            },
            set(value) {
                emit('update:modelValue', value);
            },
        });

        async function setPermission() {
            const { data } = await api.get<Permission[]>('admin/permissions');
            permissions.value = data;
        }

        void setPermission();

        async function setVisibility() {
            if (!props.visibilityId) {
                visibility.value.name = '';
                visibility.value.requiredPermissionIds = [];
                return;
            }

            const { data } = await api.get<Visibility>(
                `admin/visibilities/${props.visibilityId}`,
            );
            visibility.value.name = data.name;
            visibility.value.requiredPermissionIds = data.requiredPermissions.map(
                (p) => p.id,
            );
        }

        watch(() => props.modelValue, setVisibility, { immediate: true });

        async function createVisibility() {
            await api.post('admin/visibilities', visibility.value);
            dialog.value = false;
            emit('save');
        }

        async function updateVisibility() {
            await api.patch(
                `admin/visibilities/${props.visibilityId}`,
                visibility.value,
            );
            dialog.value = false;
            emit('save');
        }

        async function saveVisibility() {
            if (props.visibilityId) {
                await updateVisibility();
            } else {
                await createVisibility();
            }
            dialog.value = false;
            emit('save');
        }

        return {
            dialog,
            visibility,
            saveVisibility,
            permissions,
        };
    },
});
</script>
