import { DateTime } from 'luxon'
import { BaseModel, belongsTo, column, hasMany, HasMany, BelongsTo } from '@ioc:Adonis/Lucid/Orm'
import Item from './Item'
import Origin from './Origin'

export default class ContentProvider extends BaseModel {
  @column({ isPrimary: true })
  public id: number

  @column()
  public originId: number

  @column()
  public name: string

  @column()
  public path: string

  @column()
  public active: boolean

  @column()
  public config: Record<string, string>

  @column.dateTime({ autoCreate: true })
  public createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  public updatedAt: DateTime

  @hasMany(() => Item)
  public items: HasMany<typeof Item>

  @belongsTo(() => Origin)
  public origin: BelongsTo<typeof Origin>
}
