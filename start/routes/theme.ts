import Route from '@ioc:Adonis/Core/Route'

Route.get('theme/static/*', 'ThemeController.showStatic')
Route.get('video/:id', 'ThemeController.showSingle')

Route.get('*', 'ThemeController.show')
