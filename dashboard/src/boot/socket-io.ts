import { provide, inject, InjectionKey } from 'vue';

import { io, Socket } from 'socket.io-client';

const key: InjectionKey<Socket> = Symbol('socket:admin');

const providerSocket = () => {
    const socket = io('/admin', {
        path: '/api/sockets',
        auth: { token: localStorage.getItem('auth:token') || '' },
    });

    provide(key, socket);

    return socket;
};

export const useSocket = () => {
    const socket = inject(key, null);

    if (socket) {
        return socket;
    }

    return providerSocket();
};
