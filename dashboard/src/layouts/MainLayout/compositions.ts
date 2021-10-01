import { api } from 'src/boot/axios';

interface Page {
    name: string;
    label?: string;
    icon?: string;
}

export async function fetchPages() {
    const { data } = await api.get<Page[]>('pages');

    return data;
}
