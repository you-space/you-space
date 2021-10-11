import { DateTime } from 'luxon'
import { BaseModel, column, HasMany, hasMany, afterDelete, beforeSave } from '@ioc:Adonis/Lucid/Orm'
import Application from '@ioc:Adonis/Core/Application'
import Drive from '@ioc:Adonis/Core/Drive'

import Item from './Item'
import { kebabCase } from 'lodash'
import { requireIfExist } from 'App/Helpers'

export interface TypeOptions {
  label?: string
  icon?: string
  showInMenu?: boolean
}
interface Schema {
  type: 'string'
  required?: boolean
  serialize?: (raw: any) => any
}

export type TypeSchema = Record<string, Schema>

export default class Type extends BaseModel {
  @column({ isPrimary: true })
  public id: number

  @column()
  public name: string

  @column()
  public options: TypeOptions

  @column.dateTime({ autoCreate: true })
  public createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  public updatedAt: DateTime

  @column.dateTime()
  public deletedAt: DateTime | null

  public get schemaFilename() {
    return Application.makePath('content', 'schemas', `${this.id}.js`)
  }

  @hasMany(() => Item, {
    foreignKey: 'typeId',
  })
  public items: HasMany<typeof Item>

  @beforeSave()
  public static beforeSave(type: Type) {
    type.name = kebabCase(type.name)
  }

  @afterDelete()
  public static async afterDelete(type: Type) {
    await Drive.delete(type.schemaFilename)
  }

  public static fetchByIdOrName(idOrName: string | number) {
    if (!isNaN(Number(idOrName))) {
      return Type.query().where('id', idOrName).whereNull('deletedAt')
    }

    return Type.query().where('name', idOrName).whereNull('deletedAt')
  }

  public static findSchemaById(id: string | number) {
    const filename = Application.makePath('content', 'schemas', `${id}.js`)

    const schema = requireIfExist(filename)

    return schema as TypeSchema | null
  }
}
