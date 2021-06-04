import { api } from 'src/boot/axios';

export async function saveOrigin(originId: number, origin: Partial<Origin>) {
    return api.patch(`admin/origins/${originId}`, origin);
}

export interface Origin {
    id: number;
    name: string;
    providerName: string;
    valid: boolean;
    active: boolean;
    fields: { name: string }[];
    config: Record<string, string>;
    options: string[];
    updatedAt: string;
    createdAt: string;
}

interface OriginResponse {
    meta: Record<string, string>;
    data: Origin[];
}
export async function fetchOrigins() {
    const { data } = await api.get<OriginResponse>('admin/origins');
    return data;
}

export interface Provider {
    id: number;
    originId: number;
    name: string;
    active: boolean;
    config: Record<string, string>;
    fields: { name: string }[];
    options: string[];
}

export async function fetchProviders() {
    const { data } = await api.get<Provider[]>('admin/providers');

    return data;
}
