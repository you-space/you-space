import { MutationTree } from 'vuex';
import { UserState } from './state';
import { api } from 'src/boot/axios';

const mutation: MutationTree<UserState> = {
    login(state: UserState, token: string) {
        state.authenticated = true;
        state.token = token;
        localStorage.setItem('token', token);
        api.defaults.headers.common['Authorization'] = `Bearer ${String(
            token,
        )}`;
    },
    logout(state: UserState) {
        state.authenticated = false;
        state.token = null;

        localStorage.removeItem('token');
        api.defaults.headers.common['Authorization'] = null;
    },
};

export default mutation;
