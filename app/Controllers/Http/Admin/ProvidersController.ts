import PluginHelper from '@ioc:Providers/PluginHelper'
export default class ProvidersController {
  public async index() {
    const providers = await PluginHelper.fetchProviders()

    return providers.filter((p) => p.valid)
  }
}
