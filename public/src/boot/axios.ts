import { boot } from 'quasar/wrappers';
import lodash from 'lodash';
import axios, { AxiosError, AxiosInstance } from 'axios';
import { Notify } from 'quasar';

declare module '@vue/runtime-core' {
    interface ComponentCustomProperties {
        $axios: AxiosInstance;
        $api: AxiosInstance;
    }
}

const baseURL = '/api/v1';

const api = axios.create({ baseURL });
function getArrayOfMessages(requestError: AxiosError) {
    const result = [];
    const errors = lodash.get(requestError, 'response.data.errors', []);
    const message = lodash.get(requestError, 'response.data.message', null);
    const code = lodash.get(requestError, 'response.data.code', null);
    const status = lodash.get(requestError, 'response.status', null);

    if (errors.length && status === 422) {
        errors.map((err: any) =>
            result.push(`${String(err.message)}: ${String(err.field)}`),
        );
    } else if (errors.length) {
        errors.map((err: any) => result.push(err.message));
    }

    if (message) {
        result.push(message);
    }

    if (code) {
        result.push(code);
    }

    return result;
}
api.interceptors.response.use(
    (response) => response,
    (error) => {
        let messages: string[] = ['Error in server'];

        if (error.response || error.request) {
            messages = getArrayOfMessages(error);
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
