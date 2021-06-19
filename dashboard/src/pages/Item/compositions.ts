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
    const request = await api.get<ItemType>(`admin/item-types/${idOrName}`);

    return request.data;
}

// raw items
export interface AllItem {
    id: number;
    typeName: string;
    value: Record<string, string>;
}

type Filters = Pagination;

export async function fetchItemsRaw(filters?: Partial<Filters>) {
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

export async function fetchItems(type: string, filters?: Partial<Filters>) {
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

export async function findItem(type: string, id: number | string) {
    const { data } = await api.get<Item>(`item-types/${type}/items/${id}`);

    return data;
}
