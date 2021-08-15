import Route from '@ioc:Adonis/Core/Route'

Route.group(() => {
  Route.resource('items', 'ItemsController').only(['index', 'store', 'update'])
})
  .prefix('v1')
  .prefix('api')
  .middleware(['auth:api', 'acl:admin'])
