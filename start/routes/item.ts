import Route from '@ioc:Adonis/Core/Route'

Route.group(() => {
  Route.resource('items', 'ItemsController')
    .only(['index', 'store', 'update'])
    .middleware({
      store: ['auth', 'acl:admin'],
      update: ['auth', 'acl:admin'],
      destroy: ['auth', 'acl:admin'],
    })
})
  .prefix('v1')
  .prefix('api')
  .middleware('auth')
