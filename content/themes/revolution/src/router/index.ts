import { createRouter, createWebHistory, RouteRecordRaw, createMemoryHistory } from 'vue-router'

const isServer = typeof window === 'undefined'

const history = isServer ? createMemoryHistory() : createWebHistory()

const routes: Array<RouteRecordRaw> = [
  {
    path: '/',
    component: () => import('@/layouts/Default.vue'),
    children: [
      {
        path: '',
        name: 'home',
        component: () => import('@/pages/Home.vue'),
      },
      {
        path: 'videos/:videoId',
        name: 'video-single',
        props: true,
        component: () => import('@/pages/VideoSingle.vue'),
      },
    ],
  },
  // Always leave this as last one,
  // but you can also remove it
  {
    path: '/:catchAll(.*)*',
    component: () => import('@/pages/404.vue'),
  },
]

export function createAppRouter() {
  return createRouter({
    history,
    routes,
  })
}
