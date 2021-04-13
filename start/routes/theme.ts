import Route from '@ioc:Adonis/Core/Route'

Route.get('theme/static/*', 'ThemeController.showStatic')

Route.get('*', 'ThemeController.show')
