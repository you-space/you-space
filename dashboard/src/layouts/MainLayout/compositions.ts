import { api } from 'src/boot/axios';

interface Page {
    name: string;
}

export async function fetchPages() {
    const { data } = await api.get<Page[]>('admin/dashboard/pages');

    return data;
}
