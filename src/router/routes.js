import { lazy } from 'react';
import Home from '../views/Home';
import { withKeepAlive } from 'keepalive-react-component';

const routes = [{
    path: '/',
    name: 'home',
    component: withKeepAlive(Home, { cacheId: 'home', scroll: true }),
    meta: {
        title: 'Daily News-WebApp'
    }
}, {
    path: '/detail/:id',
    name: 'detail',
    component: lazy(() => import('../views/Detail')),
    meta: {
        title: 'News Details-Daily News'
    }
}, {
    path: '/personal',
    name: 'personal',
    component: lazy(() => import('../views/Personal')),
    meta: {
        title: 'Personal-Daily News'
    }
}, {
    path: '/store',
    name: 'store',
    component: lazy(() => import('../views/Store')),
    meta: {
        title: 'My favorite-Daily News'
    }
}, {
    path: '/update',
    name: 'update',
    component: lazy(() => import('../views/Update')),
    meta: {
        title: 'Modify Information-Daily News'
    }
}, {
    path: '/login',
    name: 'login',
    component: lazy(() => import('../views/Login')),
    meta: {
        title: 'log in/sign in-Daily News'
    }
}, {
    path: '*',
    name: '404',
    component: lazy(() => import('../views/Page404')),
    meta: {
        title: '404 page-Daily News'
    }
}];
export default routes;