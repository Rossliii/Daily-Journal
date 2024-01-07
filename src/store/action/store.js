import * as TYPES from '../action-types';
import api from '../../api';

const storeAction = {
    // obtain favorites list asynchronously and synchronized to redux
    async queryStoreListAsync() {
        let list = null;
        try {
            let { code, data } = await api.storeList();
            if (+code === 0) {
                list = data;
            }
        } catch (_) { }
        return {
            type: TYPES.STORE_LIST,
            list
        };
    },
    // clear favorite list
    clearStoreList() {
        return {
            type: TYPES.STORE_LIST,
            list: null
        };
    },
    // remove item in favorite list
    removeStoreListById(id) {
        return {
            type: TYPES.STORE_REMOVE,
            id
        };
    }
};
export default storeAction;