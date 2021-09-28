import * as vue from 'vue';
import { boot } from 'quasar/wrappers';
import { api } from './axios';

declare global {
    interface Window {
        vue: typeof vue;
    }
}

export default boot(async ({}) => {
    window.vue = vue;

    const { data } = await api.get('assets/import-map');

    const im = document.createElement('script');
    im.type = 'importmap';
    im.textContent = JSON.stringify(data);

    const head = document.getElementsByTagName('head')[0];

    head.appendChild(im);
});
