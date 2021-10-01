import * as vue from 'vue';
import { boot } from 'quasar/wrappers';
import { api } from './axios';
import { Notify } from 'quasar';

declare global {
    interface Window {
        vue: typeof vue;
    }
}

export async function setServerAssets() {
    const { data } = await api.get('assets/import-map');

    const im = document.createElement('script');
    im.type = 'importmap';
    im.textContent = JSON.stringify(data);

    const head = document.getElementsByTagName('head')[0];

    head.appendChild(im);
}

export function registerInjects() {
    const injects = [
        {
            name: 'notify',
            value: Notify,
        },
    ];

    injects.forEach((i) => vue.provide(i.name, i.value));
}

export default boot(() => {
    window.vue = vue;
});
