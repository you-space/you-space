import { DateTime } from 'luxon'
import { BaseModel, column } from '@ioc:Adonis/Lucid/Orm'

export default class UserAssignment extends BaseModel {
  @column({ isPrimary: true })
  public id: number

  @column({ columnName: 'role_id' })
  public roleId: number

  @column({ columnName: 'user_id' })
  public userId: string

  @column.dateTime({ autoCreate: true })
  public createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  public updatedAt: DateTime
}
