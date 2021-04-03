import Route from '@ioc:Adonis/Core/Route'

Route.group(() => {
  Route.post('/sign-up', 'AuthController.store')
  Route.post('/login', 'AuthController.login')
  Route.get('/who-i-am', 'AuthController.show').middleware('auth:api')
})
  .prefix('v1')
  .prefix('api')
