import Route from '@ioc:Adonis/Core/Route'

Route.group(() => {
  Route.resource('items', 'Admin/ItemsController').apiOnly().only(['index', 'store', 'update'])
})
  .prefix('admin')
  .prefix('v1')
  .prefix('api')
  .middleware('auth:api')
  .middleware('acl:admin')
