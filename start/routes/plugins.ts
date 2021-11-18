import Route from '@ioc:Adonis/Core/Route'

Route.group(() => {
  Route.resource('plugins', 'PluginsController').only(['index', 'store', 'update', 'destroy'])
})
  .prefix('v1')
  .prefix('api')
  .middleware('auth')
  .middleware('acl:admin')
