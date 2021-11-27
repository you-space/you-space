import Provider from 'App/Models/Provider'
import SystemMeta from 'App/Models/SystemMeta'
import PluginRepository from './PluginRepository'

class ProviderRepository {
  constructor(public pluginsRepository = PluginRepository) {}

  public async index() {
    const plugins = await this.pluginsRepository.index()

    const active = await SystemMeta.firstOrCreateMetaArray('providers:active')

    return plugins
      .filter((p) => p.active)
      .map((plugin) =>
        plugin.providers.map((p, index) => ({
          ...p,
          id: `${plugin.id}-providers-${p.id || index}`,
          plugin: plugin.serialize(['id', 'name']),
          active: active.includes(p.id),
        }))
      )
      .reduce((all, current) => all.concat(current), [])
      .map((p) => new Provider(p))
  }

  public async show(id: string) {
    const all = await this.index()
    const provider = all.find((p) => p.id === id)

    if (!provider) {
      return null
    }

    return provider
  }
}

export default new ProviderRepository()
