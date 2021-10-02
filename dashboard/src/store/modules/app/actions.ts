import { ActionTree } from 'vuex';
import { RootState } from 'src/store';
import { AppState } from './state';
import { findSiteInfo } from 'src/pages/Config/compositions';

const actions: ActionTree<AppState, RootState> = {
    async setName(context) {
        const site = await findSiteInfo();

        context.commit('setName', site.name);
    },
};

export default actions;
