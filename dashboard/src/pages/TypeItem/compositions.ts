import { api } from 'src/boot/axios';
import { ServerPagination } from 'src/components/compositions';

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

export async function deleteTypeItem(typeId: number, id: number) {
    await api.delete(`types/${typeId}/items/${id}`);
}
