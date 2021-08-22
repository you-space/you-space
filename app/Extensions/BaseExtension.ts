import { pick } from 'lodash'
import { importIfExist } from 'App/Services/Helpers'
import Type from 'App/Models/Type'
import TypeField from 'App/Models/TypeField'
import SystemMeta from 'App/Models/SystemMeta'
import { PropertyOptions } from './Decorators'

type This<T extends new (...args: any) => any> = {
  new (...args: ConstructorParameters<T>): any
} & Pick<T, keyof T>

interface Observers {
  event: string
  handler: Function
}
interface Data {
  path: string
  name: string
}

export default class BaseExtension {
  public static $properties: PropertyOptions[] = []
  public static $observers: Observers[] = []

  public propertyNames: string[]

  public name: string
  public valid = false
  public $instante: any

  public static data() {
    return Promise.resolve([] as Data[])
  }

  public static $addProperty(options: PropertyOptions) {
    this.$properties.push(options)
  }

  public static $addObserver(listener: Observers) {
    this.$observers.push(listener)
  }

  public static async $notifyAll(event: string, data?: any) {
    return Promise.all(this.$observers.filter((o) => o.event === event).map((o) => o.handler(data)))
  }

  public static async $mount<T extends This<typeof BaseExtension>>(this: T, data: Data) {
    const extension = new this() as InstanceType<T>

    extension.name = data.name

    const Class = await importIfExist(data.path)

    if (!Class) {
      return extension
    }

    extension.valid = true

    extension.propertyNames = this.$properties
      .filter((p) => p.type === 'normal')
      .map((p) => p.name)
      .concat(['name', 'valid'])

    const instance = new Class()

    extension.$instante = instance

    this.$properties
      .filter((p) => p.type === 'ext-variable')
      .forEach((p) => (extension[p.name] = instance[p.name]))

    this.$properties
      .filter((p) => p.type === 'normal')
      .forEach((p) => (extension[p.name] = data[p.name]))

    this.$properties
      .filter((p) => p.type === 'ext-method')
      .forEach((p) => {
        extension[p.name] = async () => {
          await this.$notifyAll(`before:${p.name}`, extension)

          await instance[p.name]()

          await this.$notifyAll(`after:${p.name}`, extension)
        }
      })

    Object.assign(
      instance,
      pick(extension, [
        'createType',
        'deleteType',
        'createTypeFields',
        'deleteTypeFields',
        'createProvider',
        'deleteProvider',
        'createManyItems',
      ])
    )

    return extension
  }

  public static async all<T extends This<typeof BaseExtension>>(this: T) {
    const data = await this.data()

    const all = await Promise.all(data.map((p) => this.$mount(p)))

    return all.filter((f) => !!f && f.valid) as InstanceType<T>[]
  }

  public static async find<T extends This<typeof BaseExtension>>(this: T, name: string) {
    const data = await this.data()
    const file = data.find((f) => f.name === name)

    if (!file) {
      return null
    }

    return this.$mount(file)
  }

  public static async findOrFail<T extends This<typeof BaseExtension>>(this: T, name: string) {
    const extension = await this.find(name)

    if (!extension) {
      throw new Error('file not found')
    }

    return extension
  }

  public serialize(properties?: string[]) {
    return pick(this, properties || this.propertyNames)
  }

  public updateInstance(data: any) {
    Object.assign(this.$instante, data)
  }

  public async createType(name: string, options: Type['options']) {
    await Type.updateOrCreate({ name }, { name, options, deletedAt: null })
  }

  public async deleteType(name: string) {
    const type = await Type.findBy('name', name)

    if (type) {
      await type.delete()
    }
  }

  public async createTypeFields(name: string, fields: TypeField['options'] & { name: string }[]) {
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

    await type.related('fields').query().delete().whereIn('name', fields)
  }

  public async createProvider(name: string, options: any) {
    const metaName = `providers:${name}`

    await SystemMeta.updateOrCreateMetaObject(metaName, options)
  }

  public async deleteProvider(name: string) {
    const metaName = `providers:${name}`

    const meta = await SystemMeta.findBy('name', metaName)

    if (meta) {
      await meta.delete()
    }
  }

  public async createManyItems(typeName: string, items: any[]) {
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
}
