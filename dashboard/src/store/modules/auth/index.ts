import { Module } from 'vuex';
import { RootState } from 'src/store';
import state, { AuthState } from './state';
import actions from './actions';
import mutations from './mutations';

const auth: Module<AuthState, RootState> = {
    namespaced: true,
    actions,
    mutations,
    state,
};

export default auth;
