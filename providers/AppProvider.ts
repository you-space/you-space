import { ApplicationContract } from '@ioc:Adonis/Core/Application'
import { CamelCaseNamingStrategy } from 'App/NamingStrategies/CamelCaseNamingStrategy'

export default class AppProvider {
  public static needsApplication = true

  constructor(protected app: ApplicationContract) {}

  public register() {
    // Register your own bindings
  }

  public async boot() {}

  public async ready() {
    const Content = (await import('App/Services/ContentService')).default
    const { BaseModel } = await import('@ioc:Adonis/Lucid/Orm')

    BaseModel.namingStrategy = new CamelCaseNamingStrategy()

    await Content.start()

    await import('../start/space-events')
  }
}
