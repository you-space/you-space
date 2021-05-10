import { Module } from 'vuex';
import { RootState } from '../../index';
import state, { AppState } from './state';

const app: Module<AppState, RootState> = {
    namespaced: true,
    state,
};

export * from './state';

export default app;
