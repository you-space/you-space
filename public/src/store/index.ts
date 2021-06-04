import { InjectionKey } from 'vue';
import { store } from 'quasar/wrappers';
import {
    createStore,
    Store as VuexStore,
    useStore as vuexUseStore,
} from 'vuex';
import app, { AppState } from './modules/app';
import user, { UserState } from './modules/user';

export interface RootState {
    app: AppState;
    user: UserState;
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
        modules: { user, app },
        strict: !!process.env.DEBUGGING,
    });

    return Store;
});

export function useStore() {
    return vuexUseStore(storeKey);
}
