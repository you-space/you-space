import { api } from 'src/boot/axios';

export type TypeFieldInputTypes = 'video' | 'image' | 'text' | 'textarea';
export interface TypeField {
    name: string;
    type?: 'editable';
    label: string;
    mapValue?: string;
    table?: any;
    input?: any;
}
export interface ItemType {
    id: number;
    name: string;
    options: any;
}

export async function findItemType(idOrName: string | number) {
    const config = { params: { typeId: idOrName } };

    const request = await api.get<ItemType>(`item-types/${idOrName}`, config);

    return request.data;
}
