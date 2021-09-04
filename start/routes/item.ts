import Route from '@ioc:Adonis/Core/Route'

Route.group(() => {
  Route.resource('items', 'ItemsController')
    .only(['index', 'store', 'update'])
    .middleware({
      store: ['auth:api', 'acl:admin'],
      update: ['auth:api', 'acl:admin'],
      destroy: ['auth:api', 'acl:admin'],
    })
})
  .prefix('v1')
  .prefix('api')
