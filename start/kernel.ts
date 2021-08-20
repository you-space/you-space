import Server from '@ioc:Adonis/Core/Server'

Server.middleware.register([
  () => import('@ioc:Adonis/Core/BodyParser'),
  () => import('App/Middleware/CheckDatabaseConnection'),
])

Server.middleware.registerNamed({
  auth: () => import('App/Middleware/Auth'),
  acl: () => import('App/Middleware/Acl'),
})
