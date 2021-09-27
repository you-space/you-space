import { DateTime } from 'luxon'
import { BaseModel, column } from '@ioc:Adonis/Lucid/Orm'

import { isJson } from 'App/Helpers'

export enum SystemDefaults {
  CurrentTheme = 'themes:current',
  PluginsActive = 'plugins:activated',
}

export default class SystemMeta extends BaseModel {
  @column({ isPrimary: true })
  public id: number

  @column()
  public name: string

  @column()
  public value: string

  @column.dateTime({ autoCreate: true })
  public createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  public updatedAt: DateTime

  public static fetchByName(name: string) {
    return this.query().where('name', 'like', name.replace(/\*/g, '%'))
  }

  public static async findMetaObject<T = Record<string, any>>(name: string): Promise<T | null> {
    const meta = await this.query().where('name', 'like', name.replace(/\*/g, '%')).first()

    if (!meta) {
      return null
    }

    return isJson(meta.value) ? JSON.parse(meta.value) : meta.value
  }

  public static async findOrFailMetaObject<T = any>(name: string): Promise<T> {
    const meta = await this.findByOrFail('name', name)

    return isJson(meta.value) ? JSON.parse(meta.value) : meta.value
  }

  public static async firstOrCreateMetaObject<T = any>(name: string): Promise<T> {
    const meta = await this.firstOrCreate({ name }, { name, value: JSON.stringify({}) })

    return isJson(meta.value) ? JSON.parse(meta.value) : meta.value
  }

  public static async updateOrCreateMetaObject<T = any>(name: string, value: any): Promise<T> {
    const meta = await this.firstOrCreateMetaObject(name)

    meta.value = JSON.stringify(value)

    await meta.save()

    return isJson(meta.value) ? JSON.parse(meta.value) : meta.value
  }

  public static async firstOrCreateMetaArray<T = any>(name: string): Promise<T[]> {
    const meta = await this.firstOrCreate({ name }, { name, value: JSON.stringify([]) })

    return isJson(meta.value) ? JSON.parse(meta.value) : meta.value
  }

  public static async updateOrCreateMetaArray<T = any>(name: string, value: any[]): Promise<T[]> {
    const meta = await this.firstOrCreate({ name }, { name, value: JSON.stringify([]) })

    meta.value = JSON.stringify(value)

    await meta.save()

    return isJson(meta.value) ? JSON.parse(meta.value) : meta.value
  }
}
