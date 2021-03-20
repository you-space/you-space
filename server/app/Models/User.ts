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
import UserAssignment from './UserAssignment'

export default class User extends BaseModel {
  @column({ isPrimary: true })
  public id: string

  @column({ columnName: 'origin_id' })
  public originId?: number

  @column({ columnName: 'origin_user_id' })
  public originUserId?: number

  @column()
  public email?: string

  @column()
  public username?: string

  @column({ columnName: 'display_username' })
  public displayUsername?: string

  @column({ columnName: 'avatar_src', serializeAs: 'avatarSrc' })
  public avatarSrc?: string

  @column({ serializeAs: null })
  public password: string

  @column()
  public rememberMeToken?: string

  @column.dateTime({ autoCreate: true })
  public createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  public updatedAt: DateTime

  @hasManyThrough([() => Role, () => UserAssignment], {
    foreignKey: 'userId',
    throughForeignKey: 'id',
    throughLocalKey: 'roleId',
  })
  public roles: HasManyThrough<typeof Role>

  @beforeSave()
  public static async hashPassword(user: User) {
    if (user.$dirty.password) {
      user.password = await Hash.make(user.password)
    }
  }
}
