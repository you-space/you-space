import Route from '@ioc:Adonis/Core/Route'

Route.group(() => {
  Route.resource('plugins', 'Admin/PluginsController').only(['index'])
  Route.post('plugins/start', 'Admin/PluginsController.start')
  Route.post('plugins/stop', 'Admin/PluginsController.stop')
})
  .prefix('admin')
  .prefix('v1')
  .prefix('api')
  .middleware('auth:api')
  .middleware('acl:admin')
