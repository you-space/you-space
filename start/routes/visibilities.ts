import Route from '@ioc:Adonis/Core/Route'

Route.group(() => {
  Route.resource('visibilities', 'Admin/VisibilitiesController').apiOnly()
})
  .prefix('admin')
  .prefix('v1')
  .prefix('api')
  .middleware('auth')
  .middleware('acl:admin')
