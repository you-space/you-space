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
                path: 'origins/:id',
                name: 'origins-single',
                props: true,
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
            {
                path: '/types/:typeId/items',
                name: 'type-items',
                props: true,
                component: () => import('pages/TypeItem/Index.vue'),
            },
            {
                path: '/types/:typeId/items/new',
                name: 'type-item-new',
                props: true,
                component: () => import('pages/TypeItem/Single.vue'),
            },
            {
                path: '/types/:typeId/items/:itemId',
                name: 'type-item-single',
                props: true,
                component: () => import('pages/TypeItem/Single.vue'),
            },
            {
                path: '/jobs',
                name: 'jobs',
                component: () => import('pages/Jobs/Index.vue'),
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
