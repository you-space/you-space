import { Pagination, ServerPagination } from 'src/components/compositions';
import { api } from 'src/boot/axios';
import { pickBy } from 'lodash';

// items
export interface Item {
    id: number;

    typeId: number;
    typeName: string;

    visibilityId: number;
    visibilityName: string;

    [prop: string]: string | number | Record<string, never>;
}

interface Filters extends Pagination {
    serialize: boolean;
    showOriginals: boolean;
    typeId: number;
}

export async function fetchItems(filters?: Partial<Filters>) {
    const filledFilters = pickBy(
        filters,
        (v) => v !== null && v !== undefined && v !== '',
    );

    const { data } = await api.get<ServerPagination<Item>>(`items`, {
        params: filledFilters,
    });

    return data;
}

export async function findItem(
    id: number | string,
    filters?: Partial<Filters>,
) {
    const { data } = await api.get<Item>(`items/${id}`, { params: filters });

    return data;
}

export async function saveItemFiles(
    item: Record<string, File | null | undefined>,
    id: number,
) {
    const form = new FormData();

    Object.entries(item).forEach(([key, value]) => {
        if (value === undefined) {
            return;
        }

        if (value === null) {
            form.append(key, '');
            return;
        }

        if (value.name) {
            form.append(key, value);
        }
    });

    const { data } = await api.patch(`items/${id}/files`, form);

    return data;
}

export async function saveItem(item: Record<string, unknown>, id?: number) {
    const form = new FormData();

    Object.entries(item).forEach(([key, value]) => {
        if (value === undefined) {
            return;
        }

        if (value === null) {
            form.append(key, '');
            return;
        }

        form.append(key, value as string);
    });

    if (id) {
        const { data } = await api.patch(`items/${id}`, form);

        return data;
    }

    const { data } = await api.post(`items`, form);

    return data;
}
