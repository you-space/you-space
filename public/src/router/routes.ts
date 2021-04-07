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
                        path: 'videos/:videoId',
                        name: 'video',
                        component: () => import('pages/Video.vue'),
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
                component: () => import('layouts/EmptyLayout.vue'),
                redirect: { name: 'origin-list' },
                children: [
                    {
                        path: 'origin-list',
                        name: 'origin-list',
                        component: () => import('pages/OriginList.vue'),
                    },
                    {
                        path: ':originId',
                        name: 'origin-single',
                        component: () => import('pages/OriginSingle.vue'),
                        props: true,
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
