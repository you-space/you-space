import Route from '@ioc:Adonis/Core/Route'

Route.group(() => {
  Route.resource('providers', 'ProvidersController').only(['index', 'show', 'update'])
  Route.post('providers/:id/import', 'ProvidersController.import').as('providers.import')
})
  .prefix('v1')
  .prefix('api')
  .middleware('auth')
  .middleware('acl:admin')
