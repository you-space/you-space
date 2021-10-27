import Route from '@ioc:Adonis/Core/Route'

Route.group(() => {
  Route.resource('pages', 'PagesController').only(['index', 'show'])
  Route.get('pages/:page/:file', 'PagesController.showFile')
})
  .prefix('v1')
  .prefix('api')
// .middleware('auth')
// .middleware('acl:admin')
