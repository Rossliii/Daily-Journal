import React, { useState, useEffect, useMemo } from "react";
import './Detail.less';
import { LeftOutline, MessageOutline, LikeOutline, StarOutline, MoreOutline } from 'antd-mobile-icons';
import { Badge, Toast } from 'antd-mobile';
import api from '../api';
import SkeletonAgain from '../components/SkeletonAgain';
import { flushSync } from 'react-dom';
import { connect } from 'react-redux';
import action from '../store/action';

const Detail = function Detail(props) {
    let { navigate, params } = props;
    /* define status */
    let [info, setInfo] = useState(null),
        [extra, setExtra] = useState(null);
    /* First render complete: Get the data */
    let link;
    const handleStyle = (result) => {
        let { css } = result;
        if (!Array.isArray(css)) return;
        css = css[0];
        if (!css) return;
        // create css and import <link>
        link = document.createElement('link');
        link.rel = "stylesheet";
        link.href = css;
        document.head.appendChild(link);
    };
    const handleImage = (result) => {
        let imgPlaceHolder = document.querySelector('.img-place-holder');
        if (!imgPlaceHolder) return;
        // create image
        let tempImg = new Image;
        tempImg.src = result.image;
        tempImg.onload = () => {
            imgPlaceHolder.appendChild(tempImg);
        };
        tempImg.onerror = () => {
            let parent = imgPlaceHolder.parentNode;
            parent.parentNode.removeChild(parent);
        };
    };
    useEffect(() => {
        (async () => {
            try {
                let result = await api.queryNewsInfo(params.id);
                flushSync(() => {
                    setInfo(result);
                    handleStyle(result);
                });
                handleImage(result);
            } catch (_) { }
        })();
        // Destroy component: Removes the created style
        return () => {
            if (link) document.head.removeChild(link);
        };
    }, []);
    useEffect(() => {
        (async () => {
            try {
                let result = await api.queryStoryExtra(params.id);
                setExtra(result);
            } catch (_) { }
        })();
    }, []);

    //=========The following logic is about login/favorites
    let {
        base: { info: userInfo }, queryUserInfoAsync,
        location,
        store: { list: storeList }, queryStoreListAsync, removeStoreListById
    } = props;
    useEffect(() => {
        (async () => {
            // After the first rendering: If userInfo does not exist, we send out a task to synchronize the logon information
            if (!userInfo) {
                let { info } = await queryUserInfoAsync();
                userInfo = info;
            }
            // If you have logged in &&no favorites list information: Send a task to synchronize the favorites list
            if (userInfo && !storeList) {
                queryStoreListAsync();
            }
        })();
    }, []);
    // Depending on the favorites list and path parameters, calculate whether to favorites
    const isStore = useMemo(() => {
        if (!storeList) return false;
        return storeList.some(item => {
            return +item.news.id === +params.id;
        });
    }, [storeList, params]);

    // Click the Favorites button
    const handleStore = async () => {
        if (!userInfo) {
            // not log in
            Toast.show({
                icon: 'fail',
                content: 'Please log in first'
            });
            navigate(`/login?to=${location.pathname}`, { replace: true });
            return;
        }
        // Logged in: Favorites or remove favorites
        if (isStore) {
            // remove favorites
            let item = storeList.find(item => {
                return +item.news.id === +params.id;
            });
            if (!item) return;
            let { code } = await api.storeRemove(item.id);
            if (+code !== 0) {
                Toast.show({
                    icon: 'fail',
                    content: 'Fail'
                });
                return;
            }
            Toast.show({
                icon: 'success',
                content: 'Success'
            });
            removeStoreListById(item.id); //tell redux remove it
            return;
        }
        // favorites
        try {
            let { code } = await api.store(params.id);
            if (+code !== 0) {
                Toast.show({
                    icon: 'fail',
                    content: 'fail'
                });
                return;
            }
            Toast.show({
                icon: 'success',
                content: 'success'
            });
            queryStoreListAsync(); //Synchronize the latest favorites list to the redux container
        } catch (_) { }
    };

    return <div className="detail-box">
        {/* News content */}
        {!info ? <SkeletonAgain /> :
            <div className="content"
                dangerouslySetInnerHTML={{
                    __html: info.body
                }}
            ></div>
        }
        {/* bottom icon */}
        <div className="tab-bar">
            <div className="back"
                onClick={() => {
                    navigate(-1);
                }}>
                <LeftOutline />
            </div>
            <div className="icons">
                <Badge content={extra ? extra.comments : 0}><MessageOutline /></Badge>
                <Badge content={extra ? extra.popularity : 0}><LikeOutline /></Badge>
                <span className={isStore ? 'stored' : ''}
                    onClick={handleStore}>
                    <StarOutline />
                </span>
                <span><MoreOutline /></span>
            </div>
        </div>
    </div>;
};
export default connect(
    state => {
        return {
            base: state.base,
            store: state.store
        };
    },
    { ...action.base, ...action.store }
)(Detail);