import { BaseModel, BelongsTo, belongsTo, column } from '@ioc:Adonis/Lucid/Orm'
import Role from './Role'

export default class UserRole extends BaseModel {
  @column({ isPrimary: true })
  public id: number

  @column({ columnName: 'role_id' })
  public roleId: number

  @column({ columnName: 'user_id' })
  public userId: string

  @belongsTo(() => Role)
  public role: BelongsTo<typeof Role>
}
