import { DateTime } from 'luxon'
import { BaseModel, scope, column, HasMany, hasMany } from '@ioc:Adonis/Lucid/Orm'

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

  @hasMany(() => Item, {
    foreignKey: 'typeId',
  })
  public items: HasMany<typeof Item>

  @column.dateTime({ autoCreate: true })
  public createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  public updatedAt: DateTime

  @column.dateTime()
  public deletedAt: DateTime | null

  public static isNotDeleted = scope((query) => {
    query.whereNull('deletedAt')
  })

  public static fetchByIdOrName(idOrName: string | number) {
    if (!isNaN(Number(idOrName))) {
      return Type.query().where('id', idOrName).whereNull('deletedAt')
    }

    return Type.query().where('name', idOrName).whereNull('deletedAt')
  }
}
