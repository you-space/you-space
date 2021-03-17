import Route from '@ioc:Adonis/Core/Route'

Route.group(() => {
  Route.resource('videos', 'AdminVideosController').apiOnly()
  Route.resource('origins', 'AdminOriginsController').apiOnly()
})
  .prefix('admin')
  .prefix('v1')
  .middleware('auth:api')
  .middleware('acl:admin')
