import { store } from 'quasar/wrappers';
import { createStore } from 'vuex';
import app, { AppState } from './modules/app';
import user, { UserState } from './modules/user';

export interface RootState {
    app: AppState;
    user: UserState;
}

export default store(function (/* { ssrContext } */) {
    const Store = createStore<RootState>({
        modules: { user, app },
        strict: !!process.env.DEBUGGING,
    });

    return Store;
});
