import React, { Suspense, useState, useEffect } from "react";
import { Routes, Route, useNavigate, useLocation, useParams, useSearchParams } from 'react-router-dom';
import routes from "./routes";
import { Mask, DotLoading, Toast } from 'antd-mobile';
import store from '../store';
import action from "../store/action";

/* unified route configuration */
const isCheckLogin = (path) => {
    let { base: { info } } = store.getState(),
        checkList = ['/personal', '/store', '/update'];
    return !info && checkList.includes(path);
};
const Element = function Element(props) {
    let { component: Component, meta, path } = props;
    let isShow = !isCheckLogin(path);
    let [_, setRandom] = useState(0);

    // log in vertificaiton
    useEffect(() => {
        if (isShow) return;
        (async () => {
            let infoAction = await action.base.queryUserInfoAsync();
            let info = infoAction.info;
            if (!info) {
                // If it still does not exist: No login
                Toast.show({
                    icon: 'fail',
                    content: 'Please log in first'
                });
                // jump to log in page
                navigate({
                    pathname: '/login',
                    search: `?to=${path}`
                }, { replace: true });
                return;
            }
            // If we get the information, it means we are logged in, and we send out a task to store the information in the container
            store.dispatch(infoAction);
            setRandom(+new Date());
        })();
    });

    // modify page title
    let { title = "Daily News-WebApp" } = meta || {};
    document.title = title;

    // gets routing information and passes it to components based on properties
    const navigate = useNavigate(),
        location = useLocation(),
        params = useParams(),
        [usp] = useSearchParams();

    return <>
        {isShow ?
            <Component navigate={navigate}
                location={location}
                params={params}
                usp={usp} /> :
            <Mask visible={true}>
                <DotLoading color="white" />
            </Mask>
        }
    </>;
};
export default function RouterView() {
    return <Suspense fallback={
        <Mask visible={true}>
            <DotLoading color="white" />
        </Mask>
    }>
        <Routes>
            {routes.map(item => {
                let { name, path } = item;
                return <Route key={name}
                    path={path}
                    element={
                        <Element {...item} />
                    } />;
            })}
        </Routes>
    </Suspense>;
};