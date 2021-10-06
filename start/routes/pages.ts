import Route from '@ioc:Adonis/Core/Route'

Route.group(() => {
  Route.resource('pages', 'PagesController').only(['index', 'show'])
  Route.get('pages/:id/template', 'PagesController.showTemplate')
  Route.get('pages/:id/script', 'PagesController.showScript')
  Route.get('pages/:id/styles', 'PagesController.showStyles')
})
  .prefix('v1')
  .prefix('api')
// .middleware('auth')
// .middleware('acl:admin')
