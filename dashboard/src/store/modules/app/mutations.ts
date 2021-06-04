import { MutationTree } from 'vuex';
import { AppState } from './state';

const mutation: MutationTree<AppState> = {
    setVersion(state: AppState, version: string) {
        state.version = version;
    },
};

export default mutation;
