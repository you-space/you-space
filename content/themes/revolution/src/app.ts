import { createSSRApp } from 'vue'
import App from './App.vue'
import { createAppRouter } from './router'
import store from './store'

export function createApp() {
  const app = createSSRApp(App).use(store)
  const router = createAppRouter()

  app.use(router)

  return { app, router }
}
