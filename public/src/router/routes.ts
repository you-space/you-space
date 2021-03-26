import { RouteRecordRaw } from 'vue-router';

const routes: RouteRecordRaw[] = [
    {
        path: '/',
        component: () => import('layouts/DashboardLayout.vue'),
        children: [
            { 
                path: '',
                name: 'home',
                component: () => import('pages/Index.vue') 
            },
            {
                path: 'videos',
                name: 'videos',
                component: () => import('pages/VideoList.vue') 
            },
            {
                path: 'videos/:videoId',
                name: 'video',
                component: () => import('pages/Video.vue'),
                props: true
            },
            {
                path: 'origins',
                name: 'origins',
                component: () => import('pages/OriginList.vue') 
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
