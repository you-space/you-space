import { MutationTree } from 'vuex';
import { AuthState, AuthUser } from './state';

const mutation: MutationTree<AuthState> = {
    setIsAuthenticated(state: AuthState, value: boolean) {
        state.isAuthenticated = value;
    },
    setUser(state: AuthState, user: AuthUser | null) {
        state.user = user;
    },
};

export default mutation;
