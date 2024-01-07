import React, { useEffect } from "react";
import { SwipeAction, Toast } from 'antd-mobile';
import styled from "styled-components";
import { connect } from 'react-redux';
import action from '../store/action';
import NavBarAgain from '../components/NavBarAgain';
import NewsItem from '../components/NewsItem';
import SkeletonAgain from '../components/SkeletonAgain';
import api from "../api";

/* css */
const StoreBox = styled.div`
    .box {
        padding:30px;
    }
`;

const Store = function Store(props) {
    let { list: storeList, queryStoreListAsync, removeStoreListById } = props;
    useEffect(() => {
        // First load complete: If there is no favorites list in redux, the fetch is distributed asynchronously
        if (!storeList) queryStoreListAsync();
    }, []);

    // Remove favorite
    const handleRemove = async (id) => {
        try {
            let { code } = await api.storeRemove(id);
            if (+code !== 0) {
                Toast.show({
                    icon: 'fail',
                    content: 'Fail'
                });
                return;
            }
            Toast.show({
                icon: 'success',
                content: 'success'
            });
            removeStoreListById(id);
        } catch (_) { }
    };

    return <StoreBox>
        <NavBarAgain title="My favorite" />
        {storeList ?
            <div className="box">
                {storeList.map(item => {
                    let { id, news } = item;
                    return <SwipeAction key={id} rightActions={[{
                        key: 'delete',
                        text: 'delete',
                        color: 'danger',
                        onClick: handleRemove.bind(null, id)
                    }]}>
                        <NewsItem info={news} />
                    </SwipeAction>;
                })}
            </div> :
            <SkeletonAgain />
        }
    </StoreBox>;
};
export default connect(
    state => state.store,
    action.store
)(Store);