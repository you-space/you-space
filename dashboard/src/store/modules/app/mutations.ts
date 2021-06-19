import { MutationTree } from 'vuex';
import { AppState } from './state';

const mutation: MutationTree<AppState> = {
    setVersion(state: AppState, version: string) {
        state.version = version;
    },
    setName(state: AppState, name: string) {
        state.name = name;
    },
};

export default mutation;
