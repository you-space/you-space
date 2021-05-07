import Route from '@ioc:Adonis/Core/Route'

Route.group(() => {
  Route.resource('themes', 'Admin/ThemeController').apiOnly().only(['index', 'store', 'destroy'])
  Route.get('themes/recommended-themes', 'Admin/ThemeController.recommendedThemes')
  Route.post('themes/set-theme', 'Admin/ThemeController.setTheme')
  Route.post('themes/build-theme', 'Admin/ThemeController.buildTheme')
})
  .prefix('admin')
  .prefix('v1')
  .prefix('api')
  .middleware('auth:api')
  .middleware('acl:admin')
