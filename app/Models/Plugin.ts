import { pick } from 'lodash'

interface PluginProviderField {
  name: string
  type: string
}
interface PluginProvider {
  name?: string
  description?: string
  fields?: PluginProviderField[]
}

export default class Plugin {
  public id: string
  public name: string
  public description: string
  public active: boolean
  public providers: Record<string, PluginProvider> = {}

  constructor(data: any) {
    this.id = data.id
    this.name = data.name
    this.description = data.description
    this.active = data.active
    this.providers = data.providers
  }

  public serialize(keys = ['id']) {
    return pick(this, keys || [])
  }
}
