import lodash from 'lodash';
import { axios, api } from 'src/boot/axios';

export async function downloadTheme(url: string) {
    const { data } = await api.post(`admin/themes`, {
        gitUrl: url,
    });

    return data;
}

export async function deleteThemeByName(name: string) {
    const { data } = await api.delete(`admin/themes/${name}`);

    return data;
}

export async function fetchOfficialThemes() {
    const { data } = await axios.get<string>(
        'https://raw.githubusercontent.com/you-space/docs/main/docs/theme-list.md',
    );

    const items = data
        .split('\n')
        .filter((line) => line.includes('- '))
        .map((item) => ({
            name: lodash.get(/\[(.*?)\]/.exec(item), '[1]'),
            url: lodash.get(/\((.*?)\)/.exec(item), '[1]'),
        }));

    return items;
}
