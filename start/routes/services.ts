import Route from '@ioc:Adonis/Core/Route'

Route.group(() => {
  Route.post('types/create', 'ServicesController.createType')
})
  .prefix('services')
  .prefix('v1')
  .prefix('api')
