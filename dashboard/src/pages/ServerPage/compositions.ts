import { api } from 'src/boot/axios';

export interface PageFile {
    name: string;
    type: string;
}

export interface Page {
    name: string;
    label: string;
    files: PageFile[];
}

export async function findPage(name: string) {
    const { data } = await api.get<Page>(`pages/${name}`);

    return data;
}

export async function findPageFile(pageName: string, fileName: string) {
    const { data } = await api.get<string>(`pages/${pageName}/${fileName}`);

    return data;
}
