import { DateTime } from 'luxon'
import { BaseModel, scope, column, HasMany, hasMany, afterDelete } from '@ioc:Adonis/Lucid/Orm'
import Application from '@ioc:Adonis/Core/Application'
import Drive from '@ioc:Adonis/Core/Drive'

import Item from './Item'

export interface TypeOptions {
  label?: string
  icon?: string
  showInMenu?: boolean
}

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
    return Application.makePath('content', 'schemas', `${this.name}.js`)
  }

  @hasMany(() => Item, {
    foreignKey: 'typeId',
  })
  public items: HasMany<typeof Item>

  public static isNotDeleted = scope((query) => {
    query.whereNull('deletedAt')
  })

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
}
