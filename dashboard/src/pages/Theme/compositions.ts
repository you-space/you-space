import { api } from 'src/boot/axios';

export async function downloadTheme(url: string) {
    const { data } = await api.post(`admin/themes`, {
        githubUrl: url,
    });

    return data;
}

export async function deleteThemeByName(name: string) {
    const { data } = await api.delete(`admin/themes/${name}`);

    return data;
}

export async function executeScript(themeName: string, scripts: string[]) {
    const { data } = await api.post(
        `admin/themes/${themeName}/execute-scripts`,
        {
            scripts,
        },
    );
    return data;
}
