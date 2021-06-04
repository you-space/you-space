import Route from '@ioc:Adonis/Core/Route'

Route.group(() => {
  Route.resource('origins', 'Admin/OriginsController').apiOnly().only(['index', 'store', 'update'])
  Route.get('providers', 'Admin/ProvidersController.index')
})
  .prefix('admin')
  .prefix('v1')
  .prefix('api')
  .middleware('auth:api')
  .middleware('acl:admin')
