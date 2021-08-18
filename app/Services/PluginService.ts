import path from 'path'
import Logger from '@ioc:Adonis/Core/Logger'
import { DateTime } from 'luxon'
import ItemTypeField from 'App/Models/TypeField'
import Type from 'App/Models/Type'
import SystemMeta from 'App/Models/SystemMeta'

interface ProviderOptions {
  name: string
  itemType: string
  path: string
}

type FieldRegister = ItemTypeField['options'] & { name: string }
export class PluginService {
  public logger = Logger

  constructor(public pluginName: string) {}

  public makePluginPath(...args: string[]) {
    return path.join(this.pluginName, ...args)
  }

  public async createType(name: string, options: Type['options']) {
    await Type.updateOrCreate({ name }, { name, options, deletedAt: null })
  }

  public async createTypeFields(name: string, fields: FieldRegister[]) {
    const type = await Type.findBy('name', name)

    if (!type) {
      throw new Error(`type ${name} not registered`)
    }

    await type.related('fields').updateOrCreateMany(fields, 'name')
  }

  public async deleteTypeFields(name: string, fields: string[]) {
    const type = await Type.findBy('name', name)

    if (!type) {
      throw new Error(`type ${name} not registered`)
    }

    console.log(name, fields)

    await type.related('fields').query().delete().whereIn('name', fields)
  }

  public async deleteType(name: string) {
    const type = await Type.findBy('name', name)

    if (!type) {
      throw new Error(`type ${name} not registered`)
    }

    type.deletedAt = DateTime.now()

    await type.save()
  }

  public async createProvider(name: string, options: ProviderOptions) {
    const metaName = `plugins:${this.pluginName}:providers:${name}`

    await SystemMeta.updateOrCreateMetaObject<ProviderOptions>(metaName, options)
  }

  public async unregisterProvider(providerName: string) {
    // const name = `plugins:${this.pluginName}:providers:${providerName}`
    // const option = await YsOption.findBy('name', name)
    // if (!option) {
    //   throw new Error('provider not found')
    // }
    // await option.delete()
  }
}
