import lodash from 'lodash';

import { api } from 'src/boot/axios';
import { ServerPagination } from 'src/components/compositions';
import { TypeField } from 'src/pages/Type/compositions';

interface Filters {
    page: number;
    limit: number;
}

export interface TypeItem {
    id: number;
}

export async function fetchTypeItems(
    typeId: number,
    filters?: Partial<Filters>,
) {
    const { data } = await api.get<ServerPagination<TypeItem>>(
        `types/${typeId}/items`,
        {
            params: filters,
        },
    );

    return data;
}

export async function findTypeItem(typeId: number, id: number) {
    const { data } = await api.get<TypeItem>(`types/${typeId}/items/${id}`);

    return data;
}

export async function createTypeItem(
    typeId: number,
    payload?: Partial<TypeItem>,
) {
    const { data } = await api.post<TypeItem>(`types/${typeId}/items`, payload);

    return data;
}

export async function updateTypeItem(
    typeId: number,
    itemId: number,
    payload?: Partial<TypeItem>,
) {
    const { data } = await api.patch<TypeItem>(
        `types/${typeId}/items/${itemId}`,
        payload,
    );

    return data;
}

export async function uploadTypeItemFile(
    typeId: number,
    itemId: number,
    payload: Record<string, File>,
) {
    const form = new FormData();

    Object.entries(payload).forEach(([key, value]) => form.append(key, value));

    const { data } = await api.post(
        `types/${typeId}/items/${itemId}/files`,
        form,
    );

    return data;
}

export async function deleteTypeItem(typeId: number, id: number) {
    await api.delete(`types/${typeId}/items/${id}`);
}

// utilities
export function getFieldComponentName(
    field: TypeField,
    subsets: string[] = [],
): string | null {
    let component = lodash.get(field, 'options.component', null);

    subsets.forEach((set) => {
        component = lodash.get(field, ['options', set, 'component'], component);
    });

    return component;
}

// utilities
export function getFieldProperty(
    field: TypeField,
    property: string,
    subsets: string[] = [],
): string | null {
    let result = lodash.get(field, ['options', property], null);

    subsets.forEach((set) => {
        result = lodash.get(field, ['options', set, property], result);
    });

    return result;
}

export function getFieldComponentProps(
    field: TypeField,
    subsets: string[] = [],
) {
    const props = lodash.get(field, 'options.componentProps', {});

    subsets.forEach((set) => {
        lodash.merge(
            props,
            lodash.get(field, ['options', set, 'componentProps'], {}),
        );
    });

    return props;
}