import { PluginProviderDefinition } from 'App/Models/Plugin'
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
      .map<[string, PluginProviderDefinition, string][]>((p) =>
        Object.entries(p.providers).map(([key, value]) => [key, value, p.id])
      )
      .reduce((all, current) => all.concat(current), [])
      .map(
        ([id, provider, p]) =>
          new Provider({
            id,
            name: provider.name || id,
            plugin: p,
            description: provider.description || '',
            active: active.includes(id),
            fields: provider.fields || [],
            files: provider.files || {},
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
