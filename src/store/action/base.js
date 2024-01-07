import * as TYPES from '../action-types';
import api from '../../api';

const baseAction = {
    // obtain login information asynchronously and the distribution is complete
    async queryUserInfoAsync() {
        let info = null;
        try {
            let { code, data } = await api.queryUserInfo();
            if (+code === 0) {
                info = data;
            }
        } catch (_) { }
        return {
            type: TYPES.BASE_INFO,
            info
        };
    },
    // Clear user information
    clearUserInfo() {
        return {
            type: TYPES.BASE_INFO,
            info: null
        };
    }
};
export default baseAction;