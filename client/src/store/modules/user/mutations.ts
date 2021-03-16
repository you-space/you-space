import { MutationTree } from 'vuex';
import { ExampleStateInterface } from './state';
import { api } from 'src/boot/axios';

const mutation: MutationTree<ExampleStateInterface> = {
    login (state: ExampleStateInterface, token: string) {
        state.authenticated = true;
        state.token = token;
        localStorage.setItem('token', token);
        api.defaults.headers.common['Authorization'] = `Bearer ${String(token)}`;
    },
    logout (state: ExampleStateInterface) {
        state.authenticated = false;
        state.token = null;

        localStorage.removeItem('token');
        api.defaults.headers.common['Authorization'] = null;
    }
};

export default mutation;
