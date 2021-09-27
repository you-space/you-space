import Route from '@ioc:Adonis/Core/Route'

Route.group(() => {
  Route.get('/import-map', 'AssetsController.importMap')
  Route.get('/*', 'AssetsController.show')
})
  .prefix('assets')
  .prefix('v1')
  .prefix('api')
