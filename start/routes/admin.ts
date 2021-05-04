import Route from '@ioc:Adonis/Core/Route'

Route.group(() => {
  Route.get('/', 'DashboardController.show')
  Route.get('*', 'DashboardController.show')
}).prefix('ys-admin')

Route.group(() => {
  Route.resource('videos', 'Admin/VideosController').apiOnly().only(['store', 'destroy', 'update'])

  Route.patch('videos/update-all', 'Admin/VideosController.updateAll')

  Route.resource('origins', 'Admin/OriginsController').apiOnly()
  Route.resource('origins.providers', 'Admin/ContentProvidersController').only([
    'index',
    'store',
    'update',
    'destroy',
  ])

  Route.post('origins/:origin_id/providers/:id/import', 'Admin/ContentProvidersController.import')

  Route.resource('visibilities', 'Admin/VisibilitiesController').apiOnly()
  Route.resource('permissions', 'Admin/PermissionsController').only(['index'])

  Route.resource('themes', 'Admin/ThemeController').apiOnly().only(['index', 'store', 'destroy'])
  Route.get('themes/recommended-themes', 'Admin/ThemeController.recommendedThemes')
  Route.post('themes/set-theme', 'Admin/ThemeController.setTheme')
  Route.post('themes/build-theme', 'Admin/ThemeController.buildTheme')

  Route.resource('providers', 'Admin/ProvidersController').only(['index'])
})
  .prefix('admin')
  .prefix('v1')
  .prefix('api')
  .middleware('auth:api')
  .middleware('acl:admin')
