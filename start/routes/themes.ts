import Route from '@ioc:Adonis/Core/Route'

Route.group(() => {
  Route.resource('themes', 'ThemeController').only(['index', 'store', 'destroy', 'update'])
})
  .prefix('admin')
  .prefix('v1')
  .prefix('api')
  .middleware('auth')
  .middleware('acl:admin')
