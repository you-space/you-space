import { DateTime } from 'luxon'
import { BaseModel, column, HasMany, hasMany } from '@ioc:Adonis/Lucid/Orm'
import Item from './Item'

interface ItemTypeField {
  name: string
  label?: string
  mapValue?: string
}

export interface ItemTypeOptions {
  label?: string
  icon?: string
  showInMenu?: boolean
  fields?: ItemTypeField[]
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
}
