import { api } from 'src/boot/axios';

interface TypeFieldCols {
    sm: string;
    md: string;
    lg: string;
}

export type TypeFieldInputTypes = 'video' | 'image' | 'text' | 'textarea';
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
    const config = { params: { typeId: idOrName } };

    const request = await api.get<ItemType>(`item-types/${idOrName}`, config);

    return request.data;
}
