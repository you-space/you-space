const { WebpackManifestPlugin } = require('webpack-manifest-plugin')
const nodeExternals = require('webpack-node-externals')
const webpack = require('webpack')

module.exports = {
  chainWebpack: (webpackConfig) => {
    // We need to disable cache loader, otherwise the client build
    // will used cached components from the server build
    webpackConfig.module.rule('vue').uses.delete('cache-loader')
    webpackConfig.module.rule('js').uses.delete('cache-loader')
    webpackConfig.module.rule('ts').uses.delete('cache-loader')
    webpackConfig.module.rule('tsx').uses.delete('cache-loader')

    if (!process.env.SSR) {
      // Point entry to your app's client entry file
      webpackConfig.entry('app').clear().add('./src/entry-client.ts')
      webpackConfig
        .plugin('manifest')
        .use(new WebpackManifestPlugin({ fileName: 'client-manifest.json' }))
      return
    }

    // Point entry to your app's server entry file
    webpackConfig.entry('app').clear().add('./src/entry-server.ts')

    webpackConfig.target('node')

    webpackConfig.output.libraryTarget('commonjs2')

    webpackConfig
      .plugin('manifest')
      .use(new WebpackManifestPlugin({ fileName: 'server-manifest.json' }))

    webpackConfig.externals(nodeExternals({ allowlist: /\.(css|vue)$/ }))

    webpackConfig.optimization.splitChunks(false).minimize(false)

    // webpackConfig.plugins.delete('preload')
    // webpackConfig.plugins.delete('prefetch')
    // webpackConfig.plugins.delete('progress')
    // webpackConfig.plugins.delete('friendly-errors')

    webpackConfig.plugin('limit').use(
      new webpack.optimize.LimitChunkCountPlugin({
        maxChunks: 1,
      })
    )
  },
}
