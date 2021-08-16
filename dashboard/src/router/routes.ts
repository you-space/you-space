import { RouteRecordRaw } from 'vue-router';

const routes: RouteRecordRaw[] = [
    {
        path: '/',
        component: () => import('src/layouts/MainLayout.vue'),
        children: [
            {
                path: '',
                name: 'home',
                component: () => import('pages/Index.vue'),
            },
            {
                path: 'origins',
                name: 'origins',
                component: () => import('pages/Origins/Index.vue'),
            },
            {
                path: 'themes',
                name: 'themes',
                component: () => import('pages/ThemeList.vue'),
            },
            {
                path: 'plugins',
                name: 'plugins',
                component: () => import('pages/Plugins/Index.vue'),
            },
            {
                path: 'items',
                name: 'items-all',
                component: () => import('pages/Item/Index.vue'),
            },
            {
                path: 'items/:type',
                name: 'items',
                props: true,
                component: () => import('pages/Item/List.vue'),
            },
            {
                path: 'items/:type/:id',
                props: true,
                name: 'item-single',
                component: () => import('pages/Item/Single.vue'),
            },
            {
                path: 'types',
                name: 'types',
                component: () => import('pages/Type/Index.vue'),
            },
            {
                path: 'types/:id',
                name: 'type-single',
                props: true,
                component: () => import('pages/Type/Single.vue'),
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
