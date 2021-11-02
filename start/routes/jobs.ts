import Route from '@ioc:Adonis/Core/Route'

Route.group(() => {
  Route.resource('jobs', 'JobsController').only(['index', 'show', 'destroy'])
})
  .prefix('v1')
  .prefix('api')
  .middleware('auth')
  .middleware('acl:admin')
