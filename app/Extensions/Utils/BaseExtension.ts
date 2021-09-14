import { importIfExist } from 'App/Services/Helpers'
import { This, HookListener } from './types'
import Logger from '@ioc:Adonis/Core/Logger'

export default class BaseExtension {
  public static $methods = new Map<string, any>()
  public static $listeners: HookListener[] = []
  public static $injects = new Map<string, any>()

  public $instance: any = {}

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
      Logger.error('error mount extension')
      return null
    }

    const instance = new file()

    this.$injects.forEach((value, key) => {
      if (typeof value !== 'function') {
        instance[key] = value
        return
      }

      instance[key] = (...args: any[]) => value.bind(ext)(...args)
    })

    this.$methods.forEach((_, key) => {
      ext[key] = async (...args: any) => {
        await this.$emit(`before:${key}`, ext)

        const result = await instance[key](...args)

        await this.$emit(`after:${key}`, ext)

        return result
      }
    })

    ext.$instance = instance

    return ext as InstanceType<T>
  }
}
