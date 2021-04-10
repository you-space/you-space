import Route from '@ioc:Adonis/Core/Route'

Route.get('theme/static/*', 'ThemeController.showStatic')
Route.get('videos/:id', 'ThemeController.showSingle')

Route.get('*', 'ThemeController.show')
