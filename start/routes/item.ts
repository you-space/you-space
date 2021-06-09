import Route from '@ioc:Adonis/Core/Route'

Route.group(() => {
  Route.get('admin/items', 'Admin/ItemsController.all')
    .middleware('auth:api')
    .middleware('acl:admin')

  Route.resource('item-types.items', 'Admin/ItemsController')
    .apiOnly()
    .only(['index', 'show', 'store', 'update'])
})
  .prefix('v1')
  .prefix('api')
