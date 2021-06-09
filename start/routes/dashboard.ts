import Route from '@ioc:Adonis/Core/Route'

Route.group(() => {
  Route.get('dashboard/menus', 'DashboardController.showMenu')
  Route.get('dashboard/page/:name', 'DashboardController.showPage')
})
  .prefix('admin')
  .prefix('v1')
  .prefix('api')
  .middleware('auth:api')
  .middleware('acl:admin')

Route.group(() => {
  Route.get('/', 'DashboardController.show')
  Route.get('*', 'DashboardController.show')
}).prefix('ys-admin')
