import { Pagination, ServerResponse } from 'src/components/compositions';
import { api } from 'src/boot/axios';
import { pickBy } from 'lodash';

// item-types

// raw items
export interface AllItem {
    id: number;
    typeName: string;
    value: Record<string, string>;
}

export async function fetchItemsRaw(filters?: Partial<Pagination>) {
    const request = await api.get<ServerResponse<AllItem>>('items', {
        params: pickBy(
            filters,
            (v) => v !== null && v !== undefined && v !== '',
        ),
    });

    return request.data;
}

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
    typeId: number;
}

export async function fetchItems(filters?: Partial<Filters>) {
    const filledFilters = pickBy(
        filters,
        (v) => v !== null && v !== undefined && v !== '',
    );

    const { data } = await api.get<ServerResponse<Item>>(`items`, {
        params: filledFilters,
    });

    return data;
}

interface Filters {
    showOriginals: boolean;
    serialize: boolean;
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
