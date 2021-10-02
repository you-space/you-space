import { RouteRecordRaw } from 'vue-router';

const routes: RouteRecordRaw[] = [
    {
        path: '/',
        component: () => import('src/layouts/MainLayout/Index.vue'),
        children: [
            {
                path: '',
                name: 'home',
                component: () => import('pages/Index.vue'),
            },
            {
                path: 'themes',
                name: 'themes',
                component: () => import('pages/Theme/Index.vue'),
            },
            {
                path: 'plugins',
                name: 'plugins',
                component: () => import('pages/Plugins/Index.vue'),
            },
            {
                path: 'configurations',
                name: 'configurations',
                component: () => import('pages/Config/Index.vue'),
            },
            // {
            //     path: '/server-page/:name',
            //     name: 'server-page',
            //     props: true,
            //     component: () => import('pages/ServerPage/Index.vue'),
            // },
        ],
    },
    {
        path: '/login',
        component: () => import('layouts/EmptyLayout.vue'),
        children: [
            {
                path: '',
                name: 'login',
                component: () => import('pages/Login.vue'),
            },
        ],
    },
    // Always leave this as last one,
    // but you can also remove it
    {
        path: '/:catchAll(.*)*',
        component: () => import('pages/Error404.vue'),
    },
];

export default routes;
