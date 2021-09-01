import Route from '@ioc:Adonis/Core/Route'

Route.get('/favicon.icon', () => '')
Route.get('/assets/:name', 'ClientController.assets')

Route.get('/', 'ClientController.show')
Route.get('*', 'ClientController.show')
