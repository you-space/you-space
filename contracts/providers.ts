declare module '@ioc:Providers/AuthenticateByTokenService' {
  import Service from 'App/Helpers/AuthenticateByTokenService'

  const AuthenticateByTokenService: Service

  export default AuthenticateByTokenService
}

declare module '@ioc:Providers/SocketService' {
  import Service from 'App/Helpers/SocketService'

  const SocketService: Service

  export default SocketService
}
