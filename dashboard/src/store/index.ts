import { store } from 'quasar/wrappers';
import { InjectionKey } from 'vue';
import {
    createStore,
    Store as VuexStore,
    useStore as vuexUseStore,
} from 'vuex';

import { AppState } from './modules/app/state';
import app from './modules/app';

import auth from './modules/auth';
import { AuthState } from './modules/auth/state';

export interface RootState {
    auth: AuthState;
    app: AppState;
}

// provide typings for `this.$store`
declare module '@vue/runtime-core' {
    interface ComponentCustomProperties {
        $store: VuexStore<RootState>;
    }
}

// provide typings for `useStore` helper
export const storeKey: InjectionKey<VuexStore<RootState>> = Symbol('vuex-key');

export default store(function (/* { ssrContext } */) {
    const Store = createStore<RootState>({
        modules: {
            auth,
            app,
        },
        strict: !!process.env.DEBUGGING,
    });

    return Store;
});

export function useStore() {
    return vuexUseStore(storeKey);
}
