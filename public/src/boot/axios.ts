import { boot } from 'quasar/wrappers';
import lodash from 'lodash';
import axios, { AxiosInstance } from 'axios';
import { Notify } from 'quasar';

declare module '@vue/runtime-core' {
    interface ComponentCustomProperties {
        $axios: AxiosInstance;
        $api: AxiosInstance;
    }
}

const baseURL = '/api/v1';

const api = axios.create({ baseURL });

api.interceptors.response.use(
    (response) => response,
    (error) => {
        const messages = [];
        if (error.response) {
            messages.push(
                lodash.get(error.response, 'data.message', 'Server Error'),
                lodash.get(error.response, 'data.code', 'Code not found'),
            );
        } else if (error.request) {
            messages.push('No Response from server');
        } else {
            messages.push('Cant get Error');
        }
        messages.forEach((m) =>
            Notify.create({
                type: 'negative',
                position: 'bottom-left',
                message: m,
            }),
        );
        return Promise.reject(error);
    },
);

export default boot(async ({ app, store }) => {
    let token = lodash.get(store, 'state.user.token', null);

    await axios
        .get('who-i-am', {
            baseURL: baseURL,
            headers: { Authorization: `Bearer ${String(token)}` },
        })
        .catch(() => {
            store.commit('user/logout');
            token = null;
        });

    app.config.globalProperties.$axios = axios;

    app.config.globalProperties.$api = api;
});

export { axios, api };
