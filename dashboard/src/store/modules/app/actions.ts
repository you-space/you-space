import { ActionTree } from 'vuex';
import { RootState } from 'src/store';
import { AppState } from './state';
import { findSiteInfo } from 'src/pages/Config/compositions';

const actions: ActionTree<AppState, RootState> = {
    async setName(context) {
        return findSiteInfo()
            .then((site) => context.commit('setName', site.name))
            .catch(() => context.commit('setName', 'You space'));
    },
};

export default actions;
