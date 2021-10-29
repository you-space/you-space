import Route from '@ioc:Adonis/Core/Route'

Route.group(() => {
  Route.resource('images', 'ImagesController').only(['index', 'show', 'store', 'destroy'])
})
  .prefix('v1')
  .prefix('api')
  .middleware('auth')
  .middleware('acl:admin')
