import { DateTime } from 'luxon'
import { BaseModel, column, HasMany, hasMany } from '@ioc:Adonis/Lucid/Orm'
import Item from './Item'

export enum OriginScheduleOptions {
  None = 'none',
  Minute = 'minute',
  Hour = 'hour',
  Day = 'day',
  Month = 'month',
  Week = 'week',
}
export default class Origin extends BaseModel {
  @column({ isPrimary: true })
  public id: number

  @column()
  public name: string

  @column({ serializeAs: 'providerName', serialize: (value) => value.split(':').pop() })
  public providerName: string

  @column()
  public active: boolean

  @column()
  public config: Record<string, string>

  @column.dateTime({ autoCreate: true, serializeAs: 'createdAt' })
  public createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true, serializeAs: 'updatedAt' })
  public updatedAt: DateTime

  @hasMany(() => Item, {
    foreignKey: 'originId',
  })
  public Item: HasMany<typeof Item>
}
