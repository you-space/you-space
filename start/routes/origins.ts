import Route from '@ioc:Adonis/Core/Route'

Route.group(() => {
  Route.resource('origins', 'OriginsController').only([
    'index',
    'show',
    'store',
    'update',
    'destroy',
  ])

  Route.get('providers', 'OriginsController.providers').as('origins.providers')

  Route.post('origins/:id/import', 'OriginsController.import').as('origins.import')
})
  .prefix('admin')
  .prefix('v1')
  .prefix('api')
  .middleware('auth:api')
  .middleware('acl:admin')
