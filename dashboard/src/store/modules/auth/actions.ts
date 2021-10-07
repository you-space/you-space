import { api } from 'src/boot/axios';
import { ActionTree } from 'vuex';
import { RootState } from 'src/store';
import { AuthState } from './state';
import { setAssets } from 'src/boot/space';

interface AuthUserResponse {
    id: number;
    name: string;
}

const actions: ActionTree<AuthState, RootState> = {
    async login(context) {
        try {
            const request = await api.get<AuthUserResponse>('auth/user');

            context.commit('setIsAuthenticated', true);
            context.commit('setUser', request.data);

            await setAssets();

            await context.dispatch('app/setName', null, { root: true });
        } catch (error) {
            await context.dispatch('logout');
        }
    },
    async logout(context) {
        await api.post('auth/logout').catch(console.error);

        context.commit('setIsAuthenticated', false);
        context.commit('setUser', null);
    },
};

export default actions;
