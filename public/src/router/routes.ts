import { RouteRecordRaw } from 'vue-router';

const routes: RouteRecordRaw[] = [
    {
        path: '/',
        component: () => import('layouts/DashboardLayout.vue'),
        children: [
            {
                path: '',
                name: 'home',
                component: () => import('pages/Index.vue'),
            },
            {
                path: 'videos',
                name: 'videos',
                component: () => import('layouts/EmptyLayout.vue'),
                redirect: { name: 'videos-list' },
                children: [
                    {
                        path: 'videos-list',
                        name: 'videos-list',
                        component: () => import('pages/VideoList.vue'),
                    },
                    {
                        path: ':videoId',
                        name: 'video',
                        component: () => import('src/pages/VideoSingle.vue'),
                        props: true,
                    },
                    {
                        path: 'visibilities',
                        name: 'visibilities',
                        component: () => import('src/pages/VisibilityList.vue'),
                    },
                ],
            },
            {
                path: 'origins',
                name: 'origins',
                component: () => import('pages/Origins/Index.vue'),
            },
            {
                path: 'themes',
                name: 'themes',
                component: () => import('layouts/EmptyLayout.vue'),
                redirect: { name: 'theme-list' },
                children: [
                    {
                        path: 'theme-list',
                        name: 'theme-list',
                        component: () => import('pages/ThemeList.vue'),
                    },
                ],
            },
        ],
    },
    {
        path: '/login',
        component: () => import('layouts/LoginLayout.vue'),
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
