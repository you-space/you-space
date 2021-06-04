import { Module } from 'vuex';
import { RootState } from '../../index';
import state, { AppState } from './state';
import mutations from './mutations';

const app: Module<AppState, RootState> = {
    namespaced: true,
    state,
    mutations,
};

export * from './state';

export default app;
