import { pick } from 'lodash'

import { importIfExist } from 'App/Services/Helpers'
import { PropertyOptions } from './Decorators'
import BaseExtensionQueue from './BaseExtensionQueue'
import { This } from './typings'

interface Observers {
  event: string
  handler: Function
}
interface Data {
  path: string
  name: string
}

export default class BaseExtension extends BaseExtensionQueue {
  public static $properties: PropertyOptions[] = []
  public static $observers: Observers[] = []
  public static queueName = 'unknown'

  public $instance: any
  public propertyNames: string[]
  public name: string
  public path: string
  public valid = false

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

  public static async $mountInstance(path: string) {
    const Class = await importIfExist(path)

    if (!Class) {
      return null
    }

    const instance = new Class()

    return instance
  }

  public static async $mount<T extends This<typeof BaseExtension>>(
    this: T,
    data: Data,
    extraProperties?: string[]
  ) {
    const extension = new this() as InstanceType<T>

    extension.name = data.name
    extension.path = data.path

    const instance = this.$mountInstance(data.path)

    if (!instance) {
      return extension
    }

    extension.valid = true

    extension.propertyNames = this.$properties
      .filter((p) => p.type === 'normal')
      .map((p) => p.name)
      .concat(['name', 'valid'])

    extension.$instance = instance

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

    extraProperties?.forEach((p) => (extension[p] = instance[p]))

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
    Object.assign(this.$instance, data)
  }
}
