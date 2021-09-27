import * as vue from 'vue';
import { boot } from 'quasar/wrappers';

declare global {
    interface Window {
        vue: typeof vue;
    }
}

export default boot(({}) => {
    window.vue = vue;
});
