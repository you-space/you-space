import Route from '@ioc:Adonis/Core/Route'

Route.group(() => {
  Route.post('/videos/upload', 'VideosController.upload').middleware(['auth', 'acl:admin'])

  Route.get('/videos/embed/:id', 'VideosController.embed')
  Route.resource('videos', 'VideosController')
    .only(['index', 'show', 'store', 'update', 'destroy'])
    .middleware({
      store: ['auth', 'acl:admin'],
      update: ['auth', 'acl:admin'],
      destroy: ['auth', 'acl:admin'],
    })
})
  .prefix('v1')
  .prefix('api')
