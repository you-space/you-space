import Route from '@ioc:Adonis/Core/Route'

Route.group(() => {
  Route.resource('origins', 'OriginsController').apiOnly().only(['index', 'store', 'update'])

  Route.post('origins/:id/import', 'OriginsController.import').as('origins.import')

  Route.post('origins/:id/schedule-import', 'OriginsController.updateSchedulerImport').as(
    'origins.update-import-scheduler'
  )

  Route.get('origins/:id/schedule-import', 'OriginsController.showSchedulerImport').as(
    'origins.show-import-scheduler'
  )

  Route.get('providers', 'OriginsController.providers').as('origins.providers')
})
  .prefix('admin')
  .prefix('v1')
  .prefix('api')
  .middleware('auth:api')
  .middleware('acl:admin')
