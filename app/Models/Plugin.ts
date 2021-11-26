import { pick } from 'lodash'

interface PluginProviderField {
  name: string
  type: string
}
export interface PluginProviderDefinition {
  name?: string
  description?: string
  fields?: PluginProviderField[]
  files?: Record<string, string>
}

export default class Plugin {
  public id: string
  public name: string
  public description: string
  public active: boolean
  public providers: Record<string, PluginProviderDefinition> = {}

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
