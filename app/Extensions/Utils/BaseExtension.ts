import { importIfExist } from 'App/Services/Helpers'
import { This, HookListener } from './types'

export default class BaseExtension {
  public static $methods = new Map<string, any>()
  public static $listeners: HookListener[] = []
  public static $injects = new Map<string, any>()

  public $instance: any = {}

  public name?: string

  public static $addInject(name: string, value: any) {
    this.$injects.set(name, value)
  }

  public static $addMethod(name: string) {
    this.$methods.set(name, {})
  }

  public static $addListener(listener: HookListener) {
    this.$listeners.push(listener)
  }

  public static async $emit(event: string, data: any) {
    await Promise.all(this.$listeners.filter((l) => l.event === event).map((l) => l.handler(data)))
  }

  public static async $mount<T extends This<typeof BaseExtension>>(this: T, filename: string) {
    const ext = new this()

    const file = await importIfExist(filename)

    if (!file) {
      throw new Error('error mount extension')
    }

    const instance = new file()

    this.$injects.forEach((value, key) => {
      instance[key] = value
    })

    this.$methods.forEach((_, key) => {
      ext[key] = async (...args) => {
        await this.$emit(`before:${key}`, ext)

        await instance[key](...args)

        await this.$emit(`after:${key}`, ext)
      }
    })

    ext.$instance = instance

    if (!ext.$instance.name) {
      ext.$instance.name = filename.split('/').pop()
    }

    return ext as InstanceType<T>
  }
}
