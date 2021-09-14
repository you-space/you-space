import Route from '@ioc:Adonis/Core/Route'

Route.group(() => {
  Route.resource('themes', 'ThemeController').only(['index', 'store', 'destroy'])

  Route.post('themes/set-theme', 'ThemeController.setTheme')
  Route.post('themes/:name/execute-scripts', 'ThemeController.executeScripts')

  // Route.get('themes/recommended-themes', 'Admin/ThemeController.recommendedThemes')
  // Route.post('themes/build-theme', 'Admin/ThemeController.buildTheme')
})
  .prefix('admin')
  .prefix('v1')
  .prefix('api')
  .middleware('auth:api')
  .middleware('acl:admin')
