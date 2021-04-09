import { DateTime } from 'luxon'
import Hash from '@ioc:Adonis/Core/Hash'
import {
  column,
  beforeSave,
  BaseModel,
  hasManyThrough,
  HasManyThrough,
} from '@ioc:Adonis/Lucid/Orm'
import Role from './Role'
import UserRole from './UserRole'

export default class User extends BaseModel {
  @column({ isPrimary: true })
  public id: string

  @column({ columnName: 'origin_id' })
  public originId: number

  @column({ columnName: 'user_id' })
  public userId?: string

  @column()
  public email?: string

  @column()
  public username?: string

  @column({ serializeAs: null })
  public password?: string

  @column()
  public rememberMeToken?: string

  @column({ columnName: 'origin_data' })
  public originData?: any

  @column.dateTime({ autoCreate: true })
  public createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  public updatedAt: DateTime

  @hasManyThrough([() => Role, () => UserRole], {
    foreignKey: 'userId',
    throughForeignKey: 'id',
    throughLocalKey: 'roleId',
  })
  public roles: HasManyThrough<typeof Role>

  @beforeSave()
  public static async hashPassword(user: User) {
    if (user.$dirty.password && user.password) {
      user.password = await Hash.make(user.password)
    }
  }
}
