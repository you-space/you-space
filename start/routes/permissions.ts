import Route from '@ioc:Adonis/Core/Route'

Route.group(() => {
  Route.resource('permissions', 'Admin/PermissionsController').only(['index'])
})
  .prefix('admin')
  .prefix('v1')
  .prefix('api')
  .middleware('auth')
  .middleware('acl:admin')
