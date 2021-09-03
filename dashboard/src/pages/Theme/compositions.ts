import { api } from 'src/boot/axios';

export async function executeScript(themeName: string, scripts: string[]) {
    const { data } = await api.post(
        `admin/themes/${themeName}/execute-scripts`,
        {
            scripts,
        },
    );
    return data;
}
