import { boot } from 'quasar/wrappers';
export default boot(({
    store, redirect, urlPath 
}) => {
    const token = localStorage.getItem('token');
    if (!token) {
        return;
    }

    store.commit('user/login', token);

    if (urlPath === "/login") {
        redirect({name: 'home'});
    }
    
    
});
