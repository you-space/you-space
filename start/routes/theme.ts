import Route from '@ioc:Adonis/Core/Route'

Route.get('video/:id', 'ThemeController.showSingle')

Route.get('*', 'ThemeController.show')
