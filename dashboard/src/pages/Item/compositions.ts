import { Pagination, ServerResponse } from 'src/components/compositions';
import { api } from 'src/boot/axios';
import { pickBy } from 'lodash';

export interface Item {
    id: number;
    typeName: string;
    value: Record<string, string>;
}

type Filters = Pagination;

export async function fetchItems(filters?: Partial<Filters>) {
    const filledFilters = pickBy(
        filters,
        (v) => v !== null && v !== undefined && v !== '',
    );

    const { data } = await api.get<ServerResponse<Item>>('admin/items', {
        params: filledFilters,
    });

    return data;
}
