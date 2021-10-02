import * as vue from 'vue';
import { boot } from 'quasar/wrappers';
import { api } from './axios';
import { Notify } from 'quasar';

declare global {
    interface Window {
        vue: typeof vue;
    }
}

export async function setAssets() {
    const { data } = await api.get('assets/import-map');

    const im = document.createElement('script');
    im.type = 'importmap';
    im.textContent = JSON.stringify(data);

    const head = document.getElementsByTagName('head')[0];

    head.appendChild(im);

    const SpaceModule = await import(
        /* webpackIgnore: true */
        'space'
    );

    space = SpaceModule.default;
}

export interface Space {
    on(event: string, callback: () => void | Promise<any>): any;
    emit(event: string, ...args: any[]): Promise<any>;
}

let space: Space;

export function useSpace() {
    return space;
}

export function setInjects() {
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
