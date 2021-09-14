import { ref } from 'vue';
import { api } from 'src/boot/axios';

export interface Permission {
    id: number;
    name: string;
}

export interface Visibility {
    id: number;
    name: string;
    requiredPermissions: Permission[];
}

export async function fetchVisibilities() {
    const { data } = await api.get<Visibility[]>('admin/visibilities');
    return data;
}

export function createVisibilityAutocomplete() {
    const items = ref<Visibility[]>([]);

    const autocomplete = ref({
        items,
        props: {
            options: items,
            optionValue: 'id',
            optionLabel: 'name',
            mapOptions: true,
        },
    });

    const reload = async () => {
        items.value = await fetchVisibilities();
    };

    void reload();

    return autocomplete;
}
