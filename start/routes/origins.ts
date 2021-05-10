import Route from '@ioc:Adonis/Core/Route'

Route.group(() => {
  Route.resource('origins', 'Admin/OriginsController').apiOnly().only(['index', 'update'])
})
  .prefix('admin')
  .prefix('v1')
  .prefix('api')
  .middleware('auth:api')
  .middleware('acl:admin')
