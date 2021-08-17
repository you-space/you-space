import { api } from 'src/boot/axios';
import { ServerPagination } from 'src/components/compositions';

interface Filters {
    page: number;
    limit: number;
}

export interface Type {
    id: number;
    name: string;
    options: any;
}
export interface TypeFieldOptions {
    component?: string;
    position?: 'right-sidebar' | 'body';
}
export interface TypeField {
    id: number;
    typeId: number;
    type: string;
    name: string;
    options: TypeFieldOptions;
}

export async function fetchTypes(filters?: Partial<Filters>) {
    const { data } = await api.get<ServerPagination<Type>>('types', {
        params: filters,
    });

    return data;
}

export async function findType(id: number) {
    const { data } = await api.get<Type>(`types/${id}`);

    return data;
}

export async function createType(payload: Partial<Type>) {
    const { data } = await api.post(`types`, payload);

    return data;
}

export async function updateType(id: number, payload: Partial<Type>) {
    const { data } = await api.patch(`types/${id}`, payload);

    return data;
}

export async function deleteType(id: number) {
    const { data } = await api.delete(`types/${id}`);

    return data;
}

// fields
export async function fetchTypeFields(id: number, filters?: Partial<Filters>) {
    const { data } = await api.get<ServerPagination<TypeField>>(
        `types/${id}/fields`,
        {
            params: filters,
        },
    );

    return data;
}

export async function findTypeField(typeId: number, id: number) {
    const { data } = await api.get<Type>(`types/${typeId}/fields/${id}`);

    return data;
}

export async function createTypeField(
    typeId: number,
    payload: Partial<TypeField>,
) {
    const { data } = await api.post(`types/${typeId}/fields`, payload);

    return data;
}

export async function updateTypeField(
    typeId: number,
    id: number,
    payload: Partial<TypeField>,
) {
    const { data } = await api.patch(`types/${typeId}/fields/${id}`, payload);

    return data;
}

export async function deleteTypeField(typeId: number, id: number) {
    const { data } = await api.delete(`types/${typeId}/fields/${id}`);

    return data;
}
