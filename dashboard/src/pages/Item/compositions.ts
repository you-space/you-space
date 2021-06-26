import { Pagination, ServerResponse } from 'src/components/compositions';
import { api } from 'src/boot/axios';
import { pickBy } from 'lodash';

// item-types
interface TypeFieldCols {
    sm: string;
    md: string;
    lg: string;
}

export type TypeFieldInputTypes = 'text' | 'textarea';
export interface TypeField {
    name: string;
    label: string;
    mapValue?: string;
    table?: {
        type?: string;
        show?: boolean;
        order?: number;
    };
    input?: {
        type?: TypeFieldInputTypes;
        editable: boolean;
        position?: string;
        order?: number;
        cols?: number | Partial<TypeFieldCols>;
        props?: Record<string, string>;
    };
}
export interface ItemType {
    id: number;
    name: string;
    options: Record<string, string | number | boolean>;
}

export async function findItemType(idOrName: string | number) {
    const request = await api.get<ItemType>(`item-types/${idOrName}`);

    return request.data;
}

// raw items
export interface AllItem {
    id: number;
    typeName: string;
    value: Record<string, string>;
}

export async function fetchItemsRaw(filters?: Partial<Pagination>) {
    const request = await api.get<ServerResponse<AllItem>>('admin/items', {
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

export async function fetchItems(type: string, filters?: Partial<Pagination>) {
    const filledFilters = pickBy(
        filters,
        (v) => v !== null && v !== undefined && v !== '',
    );

    const { data } = await api.get<ServerResponse<Item>>(
        `item-types/${type}/items`,
        { params: filledFilters },
    );

    return data;
}

interface Filters {
    showOriginalValues: boolean;
}

export async function findItem(
    type: string,
    id: number | string,
    filters?: Partial<Filters>,
) {
    const path = `item-types/${type}/items/${id}`;

    const { data } = await api.get<Item>(path, { params: filters });

    return data;
}

export async function saveItem(
    typeName: string,
    item: Record<string, unknown>,
    id?: number,
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

        form.append(key, value as string);
    });

    if (id) {
        const { data } = await api.patch(
            `item-types/${typeName}/items/${id}`,
            form,
        );

        return data;
    }

    const { data } = await api.post(`item-types/${typeName}/items`, form);

    return data;
}
