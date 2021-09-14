import lodash from 'lodash';
import { api, axios } from 'src/boot/axios';

export interface Plugin {
    name: string;
}

export async function fetchPlugins() {
    const { data } = await api.get<Plugin[]>('admin/plugins');

    return data;
}

export async function downloadPlugin(gitUrl: string) {
    const { data } = await api.post('admin/plugins', { gitUrl: gitUrl });

    return data;
}

export async function updatePlugin(name: string, active: boolean) {
    const { data } = await api.patch(`admin/plugins/${name}`, {
        active,
    });

    return data;
}

export async function deletePluginByName(name: string) {
    const { data } = await api.delete(`admin/plugins/${name}`);

    return data;
}
export async function fetchOfficialPlugins() {
    const { data } = await axios.get<string>(
        'https://raw.githubusercontent.com/you-space/docs/main/docs/plugin-list.md',
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
