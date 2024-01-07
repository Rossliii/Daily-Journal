import http from './http';

// update lastest news & information on the rotation chart
const queryNewsLatest = () => http.get('/api/news_latest');

// get before news
const queryNewsBefore = (time) => {
    return http.get('/api/news_before', {
        params: {
            time
        }
    });
};

// get detailed news' information
const queryNewsInfo = (id) => {
    return http.get('/api/news_info', {
        params: {
            id
        }
    });
};

// get like numbers
const queryStoryExtra = (id) => {
    return http.get('/api/story_extra', {
        params: {
            id
        }
    });
};

// send CAPTCHA
const sendPhoneCode = (phone) => {
    return http.post('/api/phone_code', {
        phone
    });
};

// log in / sign up
const login = (phone, code) => {
    return http.post('/api/login', {
        phone,
        code
    });
};

// get user information
const queryUserInfo = () => http.get('/api/user_info');

// favorite news
const store = (newsId) => {
    return http.post('/api/store', { newsId });
};

// remove favorite news
const storeRemove = (id) => {
    return http.get('/api/store_remove', {
        params: {
            id
        }
    });
};

// get favorite news
const storeList = () => http.get('/api/store_list');

// image upload "FormData format required"
const upload = (file) => {
    let fm = new FormData();
    fm.append('file', file);
    return http.post('/api/upload', fm);
};

// modify personal information
const userUpdate = (username, pic) => {
    return http.post('/api/user_update', {
        username,
        pic
    });
};


/* expose API */
const api = {
    queryNewsLatest,
    queryNewsBefore,
    queryNewsInfo,
    queryStoryExtra,
    sendPhoneCode,
    login,
    queryUserInfo,
    store,
    storeRemove,
    storeList,
    upload,
    userUpdate
};
export default api;