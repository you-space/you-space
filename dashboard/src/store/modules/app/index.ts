import { Module } from 'vuex';
import { RootState } from '../../index';
import state, { AppState } from './state';
import mutations from './mutations';
import actions from './actions';

const app: Module<AppState, RootState> = {
    namespaced: true,
    state,
    mutations,
    actions,
};

export * from './state';

export default app;
