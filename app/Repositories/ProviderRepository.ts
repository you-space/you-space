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
      .map((p) => Object.entries(p.providers || {}))
      .reduce((all, current) => all.concat(current), [])
      .map(
        ([id, provider]) =>
          new Provider({
            id,
            name: provider.name || id,
            description: provider.description || '',
            active: active.includes(id),
            fields: provider.fields || [],
          })
      )
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
