import Route from '@ioc:Adonis/Core/Route'

Route.group(() => {
  Route.resource('item-types', 'Admin/ItemTypesController')
    .apiOnly()
    .only(['index', 'show', 'store', 'update'])
})
  .prefix('admin')
  .prefix('v1')
  .prefix('api')
  .middleware('auth:api')
  .middleware('acl:admin')
