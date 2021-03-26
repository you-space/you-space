import Route from '@ioc:Adonis/Core/Route'

Route.get('/login', 'DashboardController.login')

Route.group(() => {
  // Route.get('/', 'DashboardController.show')
}).prefix('ys-admin')

Route.group(() => {
  Route.patch('videos/update-all', 'AdminVideosController.updateAll')
  Route.resource('videos', 'AdminVideosController').apiOnly()
  Route.resource('origins', 'AdminOriginsController').apiOnly()
})
  .prefix('admin')
  .prefix('v1')
// .middleware('auth:api')
// .middleware('acl:admin')
