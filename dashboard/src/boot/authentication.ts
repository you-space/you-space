import { boot } from 'quasar/wrappers';

export default boot(({ store }) => {
    const token = localStorage.getItem('auth:token');
    void store.dispatch('auth/login', token);
});
