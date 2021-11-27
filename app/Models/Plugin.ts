import { findConfig } from 'App/Helpers'
import Content from 'App/Services/ContentService'
import { pick } from 'lodash'
import SystemMeta from './SystemMeta'

interface PluginProviderField {
  name: string
  type: string
}
export interface ProviderDefinition {
  id?: string
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
  public providers: ProviderDefinition[]

  constructor(id: string) {
    this.id = id
  }

  public get folder() {
    return Content.makePath('plugins', this.id)
  }

  public serialize(keys = ['id']) {
    return pick(this, keys || [])
  }

  public findConfig() {
    return findConfig(this.folder)
  }

  public async load() {
    const config = await this.findConfig()
    const pluginsActive = await SystemMeta.firstOrCreateMetaArray('plugins:active')

    this.name = config.name || this.id
    this.description = config.description || ''
    this.active = pluginsActive.includes(this.id)
    this.providers = config.providers || []
  }
}
