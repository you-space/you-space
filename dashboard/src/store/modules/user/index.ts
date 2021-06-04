import { Module } from 'vuex';
import { RootState } from '../../index';
import state, { UserState } from './state';
import mutations from './mutations';

const user: Module<UserState, RootState> = {
    namespaced: true,
    mutations,
    state,
};

export * from './state';

export default user;
