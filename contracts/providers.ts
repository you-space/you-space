declare module '@ioc:Providers/AuthenticateByTokenService' {
  import Service from 'App/Services/AuthenticateByTokenService'

  const AuthenticateByTokenService: Service

  export default AuthenticateByTokenService
}

declare module '@ioc:Providers/SocketService' {
  import Service from 'App/Services/SocketService'

  const SocketService: Service

  export default SocketService
}

declare module '@ioc:Providers/PluginHelper' {
  import Service from 'App/Services/PluginHelper'

  const PluginHelper: Service

  export default PluginHelper
}
