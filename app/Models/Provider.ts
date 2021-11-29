import { pick } from 'lodash'
import Plugin from './Plugin'
import SystemMeta from './SystemMeta'

interface Field {
  name: string
  type?: string
  value?: any
  encrypted?: boolean
  required?: boolean
}

export default class Provider {
  public id: string
  public name: string
  public plugin: Pick<Plugin, 'id' | 'name'>
  public description: string
  public active: boolean

  public fields: Field[] = []
  public files: Record<string, any> = {}

  public import = 'none' as 'none' | 'daily' | 'weekly' | 'monthly'

  constructor(data: any) {
    this.id = data.id
    this.name = data.name
    this.plugin = data.plugin
    this.description = data.description
    this.active = data.active
    this.fields = data.fields
    this.files = data.files
  }

  public serialize(keys = ['id']) {
    return pick(this, keys || [])
  }

  public async load() {
    await this.loadImport()
    await this.loadFieldValues()
  }

  public async loadImport() {
    const meta = await SystemMeta.firstOrCreate(
      {
        name: `providers:${this.id}:import`,
      },
      {
        name: `providers:${this.id}:import`,
        value: 'none',
      }
    )

    this.import = meta.value as Provider['import']
  }

  public async loadFieldValues() {
    const config = await SystemMeta.firstOrCreateMetaArray(`providers:${this.id}:config`)

    this.fields = this.fields.map((field) => {
      const value = config.find((c) => c.name === field.name)

      return {
        ...field,
        value: value?.value || null,
        encrypted: !!value?.encrypted,
      }
    })
  }

  public async update(data: Pick<Provider, 'active' | 'fields' | 'import'>) {
    const active = await SystemMeta.firstOrCreateMetaArray('providers:active')

    if (data.active) {
      active.push(this.id)
    }

    if (!data.active) {
      active.splice(active.indexOf(this.id), 1)
    }

    await SystemMeta.updateOrCreateMetaArray('providers:active', active)

    await SystemMeta.updateOrCreate(
      {
        name: `providers:${this.id}:import`,
      },
      {
        name: `providers:${this.id}:import`,
        value: data.import || this.import,
      }
    )

    const config = this.fields.map((field) => {
      const value = data.fields.find((c) => c.name === field.name)

      return {
        name: field.name,
        value: value?.value || null,
        encrypted: value ? !!value?.encrypted : field.encrypted,
      }
    })

    await SystemMeta.updateOrCreateMetaArray(`providers:${this.id}:config`, config)
  }
}
