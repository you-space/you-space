import { createRouter, createWebHistory, RouteRecordRaw, createMemoryHistory } from 'vue-router'

const isServer = typeof window === 'undefined'

const history = isServer ? createMemoryHistory() : createWebHistory()

const routes: Array<RouteRecordRaw> = [
  {
    path: '/',
    name: 'Home',
    component: () => import('@/pages/Home.vue'),
  },
]

export function createAppRouter() {
  return createRouter({
    history,
    routes,
  })
}
