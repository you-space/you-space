import { DateTime } from 'luxon'
import { types } from '@ioc:Adonis/Core/Helpers'
import {
  BaseModel,
  beforeFetch,
  beforeFind,
  column,
  HasMany,
  hasMany,
  ModelQueryBuilderContract,
} from '@ioc:Adonis/Lucid/Orm'

import Item from './Item'
import TypeField from './TypeField'

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

  @hasMany(() => TypeField, {
    foreignKey: 'typeId',
  })
  public fields: HasMany<typeof TypeField>

  @beforeFetch()
  @beforeFind()
  public static beforeFind(query: ModelQueryBuilderContract<typeof Type>) {
    query.whereNull('deletedAt')
  }

  public static fetchByIdOrName(idOrName: string | number) {
    if (types.isNumber(idOrName)) {
      return Type.query().where('id', idOrName).whereNull('deletedAt')
    }

    return Type.query().where('name', idOrName).whereNull('deletedAt')
  }
}
