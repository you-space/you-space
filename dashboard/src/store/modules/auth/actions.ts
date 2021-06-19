import { api } from 'src/boot/axios';
import { ActionTree } from 'vuex';
import { RootState } from 'src/store';
import { AuthState } from './state';

interface AuthUserResponse {
    id: number;
    name: string;
}

const actions: ActionTree<AuthState, RootState> = {
    async login(context, token: string) {
        try {
            localStorage.setItem('auth:token', token);

            api.defaults.headers.common['Authorization'] = `Bearer ${token}`;

            const request = await api.get<AuthUserResponse>('auth/user');

            context.commit('setIsAuthenticated', true);
            context.commit('setUser', request.data);
        } catch (error) {
            await context.dispatch('logout');
        }
    },
    async logout(context) {
        await api.post('auth/logout').catch(console.error);
        localStorage.removeItem('auth:token');

        api.defaults.headers.common['Authorization'] = undefined;

        context.commit('setIsAuthenticated', false);
        context.commit('setUser', null);
    },
};

export default actions;
