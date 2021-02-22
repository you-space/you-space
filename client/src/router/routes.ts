import { RouteRecordRaw } from 'vue-router';

const routes: RouteRecordRaw[] = [
    {
        path: '/ys-admin',
        component: () => import('layouts/DashboardLayout.vue'),
        children: [
            {
                path: '',
                name: 'dashboard',
                component: () => import('pages/Index.vue')
            },
            {
                path: 'videos',
                component: () => import('pages/VideoList.vue') 
            },
            {
                path: 'videos/:videoId',
                component: () => import('pages/Video.vue') 
            },
        ],
    },
    {
        path: '/',
        component: () => import('layouts/MainLayout.vue'),
        children: [],
    },

    // Always leave this as last one,
    // but you can also remove it
    {
        path: '/:catchAll(.*)*',
        component: () => import('pages/Error404.vue'),
    },
];

export default routes;
