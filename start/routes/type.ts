import Route from '@ioc:Adonis/Core/Route'

Route.group(() => {
  Route.resource('types', 'TypesController')
    .only(['index', 'show', 'store', 'update', 'destroy'])
    .middleware({
      store: ['auth:api', 'acl:admin'],
      update: ['auth:api', 'acl:admin'],
      destroy: ['auth:api', 'acl:admin'],
    })
})
  .prefix('v1')
  .prefix('api')
