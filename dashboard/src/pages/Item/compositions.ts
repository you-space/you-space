import { Pagination, ServerResponse } from 'src/components/compositions';
import { api } from 'src/boot/axios';
import { pickBy } from 'lodash';

export interface AllItem {
    id: number;
    typeName: string;
    value: Record<string, string>;
}

export interface Item {
    id: number;

    typeId: number;
    typeName: string;

    visibilityId: number;
    visibilityName: string;

    [prop: string]: string | number | Record<string, never>;
}

type Filters = Pagination;

export async function fetchAllItems(filters?: Partial<Filters>) {
    const filledFilters = pickBy(
        filters,
        (v) => v !== null && v !== undefined && v !== '',
    );

    const request = await api.get<ServerResponse<AllItem>>('admin/items', {
        params: filledFilters,
    });

    return request.data;
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
