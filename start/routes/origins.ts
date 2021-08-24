import Route from '@ioc:Adonis/Core/Route'

Route.group(() => {
  Route.resource('origins', 'OriginsController').apiOnly().only(['index', 'store', 'update'])

  Route.post('origins/:id/import', 'ImportsController.import').as('origins.import')
  Route.get('origins/:id/schedule', 'ImportsController.showSchedule').as('origins.show-schedule')
  Route.post('origins/:id/schedule', 'ImportsController.schedule').as('origins.schedule')
})
  .prefix('admin')
  .prefix('v1')
  .prefix('api')
  .middleware('auth:api')
  .middleware('acl:admin')
