import { createApp } from './app'

createApp()
  .then(async ({ app, router }) => {
    await router.isReady()

    app.mount('#app')
  })
  .catch((err) => {
    console.error(err)
  })
