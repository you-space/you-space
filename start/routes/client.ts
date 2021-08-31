import Route from '@ioc:Adonis/Core/Route'

Route.get('/', 'ClientController.show')
Route.get('*', 'ClientController.show')
