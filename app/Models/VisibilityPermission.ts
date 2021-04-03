import { DateTime } from 'luxon'
import { BaseModel, column } from '@ioc:Adonis/Lucid/Orm'

export default class VisibilityPermission extends BaseModel {
  @column({ isPrimary: true })
  public id: number

  @column({ columnName: 'visibility_id' })
  public visibilityId: number

  @column({ columnName: 'permission_id' })
  public permissionId: number

  @column.dateTime({ autoCreate: true })
  public createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  public updatedAt: DateTime
}
