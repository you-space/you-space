import { boot } from 'quasar/wrappers';

export default boot(async ({ store }) => {
    await store.dispatch('auth/login');
});
