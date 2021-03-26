import Route from '@ioc:Adonis/Core/Route'

Route.group(() => {
  Route.get('/', 'DashboardController.show')
  Route.get('*', 'DashboardController.show')
}).prefix('ys-admin')

Route.group(() => {
  Route.resource('videos', 'AdminVideosController').apiOnly()
  Route.patch('videos/update-all', 'AdminVideosController.updateAll')
  Route.resource('origins', 'AdminOriginsController').apiOnly()
})
  .prefix('admin')
  .prefix('v1')
  .prefix('api')
// .middleware('auth:api')
// .middleware('acl:admin')
