// declare module '@ioc:Providers/YouTube' {
//   import YouTubeProvider from 'providers/YouTubeProvider'

//   const provider: YouTubeProvider

//   export default provider
// }

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
