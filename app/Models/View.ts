import { DateTime } from 'luxon'
import { BaseModel, column } from '@ioc:Adonis/Lucid/Orm'

export default class View extends BaseModel {
  @column({ isPrimary: true })
  public id: string

  @column({ columnName: 'entity_item_id' })
  public entityItemId: string

  @column()
  public sourceCount: number

  @column()
  public count: number

  @column.dateTime({ autoCreate: true })
  public createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  public updatedAt: DateTime
}
