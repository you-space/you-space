import Route from '@ioc:Adonis/Core/Route'

Route.group(() => {
  Route.post('/sign-up', 'AuthController.store')
  Route.post('/login', 'AuthController.login')

  Route.post('/logout', 'AuthController.logout').middleware('auth')
  Route.get('/user', 'AuthController.show').middleware('auth')
})
  .prefix('auth')
  .prefix('v1')
  .prefix('api')
