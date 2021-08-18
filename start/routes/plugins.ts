import Route from '@ioc:Adonis/Core/Route'

Route.group(() => {
  Route.resource('plugins', 'PluginsController').only(['index', 'store', 'update', 'destroy'])
})
  .prefix('admin')
  .prefix('v1')
  .prefix('api')
  .middleware('auth:api')
  .middleware('acl:admin')
