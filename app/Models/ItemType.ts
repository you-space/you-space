import { DateTime } from 'luxon'
import { types } from '@ioc:Adonis/Core/Helpers'
import { BaseModel, column, HasMany, hasMany } from '@ioc:Adonis/Lucid/Orm'

import Item from './Item'
import ItemTypeField from './ItemTypeField'

export interface ItemTypeOptions {
  label?: string
  icon?: string
  showInMenu?: boolean
}

export default class ItemType extends BaseModel {
  @column({ isPrimary: true })
  public id: number

  @column()
  public name: string

  @column()
  public options: ItemTypeOptions

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

  @hasMany(() => ItemTypeField, {
    foreignKey: 'typeId',
  })
  public fields: HasMany<typeof ItemTypeField>

  public static fetchByIdOrName(idOrName: string | number) {
    if (types.isNumber(idOrName)) {
      return ItemType.query().where('id', idOrName).whereNull('deletedAt')
    }

    return ItemType.query().where('name', idOrName).whereNull('deletedAt')
  }
}
