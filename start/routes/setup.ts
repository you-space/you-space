import Route from '@ioc:Adonis/Core/Route'

Route.get('setup', 'SetupController.show').as('setup.show')
Route.post('setup', 'SetupController.store').as('setup.store')
