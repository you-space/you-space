const path = require('path')
const fs = require('fs')
const { renderToString } = require('@vue/server-renderer')

const serverManifest = require('./dist/server-app/server-manifest.json')
const clientManifest = require('./dist/client-app/client-manifest.json')

const setup = {
  staticFiles() {
    return Object.values(clientManifest).reduce(
      (files, key) => ({
        ...files,
        [key]: path.join(__dirname, 'dist', 'client-app', key),
      }),
      {}
    )
  },
  async render({ request, response }) {
    const appPath = path.join(__dirname, 'dist', 'server-app', serverManifest['app.js'])
    const { app, router } = require(appPath).default

    router.push(request.url())

    await router.isReady()

    const appContent = await renderToString(app)
    const appHtml = fs.readFileSync(
      path.join(__dirname, 'dist', 'client-app', clientManifest['index.html']),
      'utf-8'
    )

    response.send(appHtml.replace('<div id="app"></div>', `<div id="app">${appContent}</div>`))
  },
}

module.exports = setup
