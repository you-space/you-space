import Route from '@ioc:Adonis/Core/Route'

Route.group(() => {
  Route.get('jobs', 'JobsController.index')
  Route.patch('jobs', 'JobsController.update')
})
  .prefix('admin')
  .prefix('v1')
  .prefix('api')
  .middleware('auth:api')
  .middleware('acl:admin')
