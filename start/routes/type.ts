import Route from '@ioc:Adonis/Core/Route'

Route.group(() => {
  Route.resource('types', 'TypesController')
    .only(['index', 'show', 'store', 'update', 'destroy'])
    .middleware({
      store: ['auth', 'acl:admin'],
      update: ['auth', 'acl:admin'],
      destroy: ['auth', 'acl:admin'],
    })
})
  .prefix('v1')
  .prefix('api')
