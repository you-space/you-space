declare module '@ioc:Providers/Visibility' {
  import VisibilityProvider from 'providers/VisibilityProvider'

  const provider: VisibilityProvider

  export default provider
}

declare module '@ioc:Providers/OriginMainProvider' {
  import Origin from 'App/Models/Origin'

  const OriginMain: Origin

  export default OriginMain
}

declare module '@ioc:Providers/OriginService' {
  import Service from 'App/Services/Origin/OriginService'

  const OriginService: Service

  export default OriginService
}
declare module '@ioc:Providers/Queue/OriginQueue' {
  import Queue from 'App/Services/Queue/OriginQueue'

  const OriginQueue: Queue

  export default OriginQueue
}
