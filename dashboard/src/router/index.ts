import { route } from 'quasar/wrappers';
import {
    createMemoryHistory,
    createRouter,
    createWebHashHistory,
    createWebHistory,
    Router,
} from 'vue-router';
import { RootState } from '../store';
import routes from './routes';

let router: Router;

function geRouteHistoryMode() {
    if (process.env.SERVER) {
        return createMemoryHistory;
    }

    if (process.env.VUE_ROUTER_MODE === 'history') {
        return createWebHistory;
    }

    return createWebHashHistory;
}

export default route<RootState>(function (/* { store, ssrContext } */) {
    const createHistory = geRouteHistoryMode();

    const Router = createRouter({
        scrollBehavior: () => ({ left: 0, top: 0 }),
        routes,
        history: createHistory(
            process.env.MODE === 'ssr' ? void 0 : process.env.VUE_ROUTER_BASE,
        ),
    });

    router = Router;

    return Router;
});

export { router };
