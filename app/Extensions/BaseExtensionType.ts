import { pick } from 'lodash'

import SystemMeta from 'App/Models/SystemMeta'
import Type from 'App/Models/Type'
import TypeField from 'App/Models/TypeField'
import { This } from './typings'

export class BaseExtensionType {
  public static async createType(name: string, options: Type['options']) {
    await Type.updateOrCreate({ name }, { name, options, deletedAt: null })
  }

  public async deleteType(name: string) {
    const type = await Type.findBy('name', name)

    if (type) {
      await type.delete()
    }
  }

  public static async createTypeFields(
    name: string,
    fields: TypeField['options'] & { name: string }[]
  ) {
    const type = await Type.findBy('name', name)

    if (!type) {
      throw new Error(`type ${name} not registered`)
    }

    await type.related('fields').updateOrCreateMany(fields, 'name')
  }

  public static async deleteTypeFields(name: string, fields: string[]) {
    const type = await Type.findBy('name', name)

    if (!type) {
      throw new Error(`type ${name} not registered`)
    }

    await type.related('fields').query().delete().whereIn('name', fields)
  }

  public static async createProvider(name: string, options: any) {
    const metaName = `providers:${name}`

    await SystemMeta.updateOrCreateMetaObject(metaName, options)
  }

  public static async deleteProvider(name: string) {
    const metaName = `providers:${name}`

    const meta = await SystemMeta.findBy('name', metaName)

    if (meta) {
      await meta.delete()
    }
  }

  // items

  public static async createManyItems(typeName: string, items: any[]) {
    const type = await Type.query().where('name', typeName).whereNull('deletedAt').first()

    if (!type) {
      throw new Error('type not found')
    }

    return type.related('items').updateOrCreateMany(
      items.map((item) => ({
        sourceId: item.id,
        value: item.data,
      })),
      ['sourceId', 'typeId']
    )
  }

  public static $mount(keys?: keyof typeof BaseExtensionType) {
    if (!keys) {
      return pick(this, [
        'createType',
        'createTypeFields',
        'deleteType',
        'deleteTypeFields',
        'createManyItems',
      ])
    }

    return pick(this, keys)
  }
}
