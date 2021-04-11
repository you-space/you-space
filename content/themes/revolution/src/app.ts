import App from './App.vue'
import { createSSRApp } from 'vue'
import { createAppRouter } from './router'
import store from './store'
import bootPlugins from './boot'

export async function createApp() {
  const app = createSSRApp(App)
  const router = createAppRouter()

  await bootPlugins(app)

  app.use(store)

  app.use(router)

  return { app, router }
}
