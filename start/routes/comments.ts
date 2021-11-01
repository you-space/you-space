import Route from '@ioc:Adonis/Core/Route'

Route.group(() => {
  Route.resource('comments', 'CommentsController').only([
    'index',
    'show',
    'store',
    'update',
    'destroy',
  ])
})
  .prefix('v1')
  .prefix('api')
  .middleware('auth')
  .middleware('acl:admin')
