import Route from '@ioc:Adonis/Core/Route'

Route.group(() => {
  Route.resource('types.fields', 'TypeFieldsController')
    .apiOnly()
    .only(['index', 'show', 'store', 'update', 'destroy'])
})
  .middleware(['auth:api', 'acl:admin'])
  .prefix('v1')
  .prefix('api')
