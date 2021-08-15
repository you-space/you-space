import Route from '@ioc:Adonis/Core/Route'

Route.group(() => {
  Route.resource('items', 'ItemsController').only(['index', 'store'])
  // Route.resource('items', 'ItemsController')
  //   .only(['index', 'show', 'update'])
  //   .middleware({
  //     update: ['auth:api', 'acl:admin'],
  //   })

  // Route.patch('items/:id/files', 'ItemsController.updateItemFiles').middleware([
  //   'auth:api',
  //   'acl:admin',
  // ])
})
  .prefix('v1')
  .prefix('api')
  .middleware(['auth:api', 'acl:admin'])
