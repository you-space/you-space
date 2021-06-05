import { boot } from 'quasar/wrappers';
import { io } from 'socket.io-client';

const useSocketIo = () => {
    return io('/admin', {
        path: '/api/sockets',
        auth: { token: localStorage.getItem('token') || '' },
    });
};

export default boot(() => {
    // Set i18n instance on app
    // app.use(i18n);
});

export { useSocketIo };
