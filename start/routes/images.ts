import Route from '@ioc:Adonis/Core/Route'

Route.group(() => {
  Route.post('/images/upload', 'ImagesController.upload')
  Route.get('/images/embed/:id', 'ImagesController.embed')
  Route.resource('images', 'ImagesController').only(['index', 'show', 'store', 'update', 'destroy'])
})
  .prefix('v1')
  .prefix('api')
  .middleware('auth')
  .middleware('acl:admin')
