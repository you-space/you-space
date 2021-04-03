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

const api = axios.create({baseURL});

api.interceptors.response.use(function (response) {
    return response;
}, function (error) {
    let message;
    if (error.response) {
        message = lodash.get(error.response, 'data.errors[0].message', 'Server Error');
    } else if (error.request) {
        message = 'No Response from server';
    } else {
        message = error.message;
    }
    Notify.create({
        type: 'negative',
        position: 'bottom-left',
        message: message
    });
    return Promise.reject(error);
});

export default boot(async ({ app, store }) => {
    let token = lodash.get(store, 'state.user.token', null);
    
    await axios.get('who-i-am', {
        baseURL: baseURL,
        headers: {Authorization: `Bearer ${String(token)}`}
    })
        .catch(() => {
            store.commit('user/logout');
            token = null;
        });
    
    app.config.globalProperties.$axios = axios;

    app.config.globalProperties.$api = api;
});

export { axios, api };
