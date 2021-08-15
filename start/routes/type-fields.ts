import Route from '@ioc:Adonis/Core/Route'

Route.group(() => {
  Route.resource('types.fields', 'TypeFieldsController').apiOnly().only(['index', 'store'])
})
  .middleware(['auth:api', 'acl:admin'])
  .prefix('v1')
  .prefix('api')
