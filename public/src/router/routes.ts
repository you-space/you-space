import { RouteRecordRaw } from 'vue-router';

const routes: RouteRecordRaw[] = [
    {
        path: '/ys-admin',
        component: () => import('layouts/DashboardLayout.vue'),
        children: [
            { 
                path: '',
                name: 'admin',
                component: () => import('pages/Index.vue') 
            },
            {
                path: 'videos',
                name: 'admin-videos',
                component: () => import('pages/AdminVideoList.vue') 
            },
            {
                path: 'videos/:videoId',
                name: 'admin-video',
                component: () => import('pages/AdminVideo.vue'),
                props: true
            },
            {
                path: 'origins',
                name: 'admin-origins',
                component: () => import('pages/AdminOriginList.vue') 
            },
        ],
    },
    {
        path: '/login',
        component: () => import('layouts/EmptyLayout.vue'),
        children: [
            {
                path: '',
                name: 'login',
                component: () => import('pages/Login.vue')
            }
        ]
    },
    {
        path: '/',
        component: () => import('layouts/MainLayout.vue'),
        children: [
            {
                path: '',
                name: 'home',
                component: () => import('pages/Home.vue')
            },
            {
                path: 'video/:videoId',
                name: 'video',
                props: true,
                component: () => import('pages/Video.vue')
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
