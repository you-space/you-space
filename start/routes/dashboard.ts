import Route from '@ioc:Adonis/Core/Route'

Route.group(() => {
  Route.get('dashboard/pages', 'DashboardController.findPages')
  Route.get('dashboard/pages/:name', 'DashboardController.showPage')
})
  .prefix('admin')
  .prefix('v1')
  .prefix('api')
// .middleware('auth:api')
// .middleware('acl:admin')

Route.group(() => {
  Route.get('/', 'DashboardController.show')
  Route.get('*', 'DashboardController.show')
}).prefix('ys-admin')
