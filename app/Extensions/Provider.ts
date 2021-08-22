import Origin from 'App/Models/Origin'
import SystemMeta from 'App/Models/SystemMeta'
import { DoneCallback, Job } from 'bull'
import BaseExtension from './BaseExtension'
import BaseExtensionQueue, { ExtensionJobOptions } from './BaseExtensionQueue'
import { BaseExtensionType } from './BaseExtensionType'
import { extProperty } from './Decorators'

export interface ProviderOptions {
  name: string

  path: string

  pluginName: string

  fields: any[]
}

export interface ProviderJobOptions extends ExtensionJobOptions {
  originId?: number
}

export default class Provider extends BaseExtension {
  public static extName = 'plugin'
  public static queueName = 'plugin'

  public static data = async () => {
    const metas = await SystemMeta.fetchByName(`providers:*`)
    return metas.map((meta) => {
      const [, name] = meta.name.split(':')

      const options: ProviderOptions = JSON.parse(meta.value)

      return {
        ...options,
        name,
      }
    })
  }

  public static async create(name: string, options: any) {
    const metaName = `providers:${name}`

    await SystemMeta.updateOrCreateMetaObject(metaName, options)
  }

  public static async delete(name: string) {
    const metaName = `providers:${name}`

    const meta = await SystemMeta.findBy('name', metaName)

    if (meta) {
      await meta.delete()
    }
  }

  @extProperty('ext-method')
  public import: () => Promise<void>

  @extProperty('ext-variable')
  public fields: any[]

  public static async process(job: Job<ProviderJobOptions>, done: DoneCallback) {
    const { path, method, originId } = job.data

    const instance = await Provider.$mountInstance(path)

    if (!instance || !instance[method]) {
      return done(new Error('file or method not found'))
    }

    if (originId) {
      const origin = await Origin.find(originId)
      instance.config = origin?.config
    }

    Object.assign(instance, BaseExtensionType.$mount())
    Object.assign(instance, BaseExtensionQueue.$mountQueue())

    instance[method]()

    done()
  }
}
