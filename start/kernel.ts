import Server from '@ioc:Adonis/Core/Server'

Server.middleware.register([
  () => import('@ioc:Adonis/Core/BodyParser'),
  () => import('App/Middleware/SetupCheck'),
  () => import('App/Middleware/SilentAuth'),
  () => import('App/Middleware/Space'),
])

Server.middleware.registerNamed({
  auth: () => import('App/Middleware/Auth'),
  acl: () => import('App/Middleware/Acl'),
})
