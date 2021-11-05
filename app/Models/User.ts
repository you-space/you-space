import { DateTime } from 'luxon'
import Hash from '@ioc:Adonis/Core/Hash'
import {
  column,
  beforeSave,
  BaseModel,
  hasManyThrough,
  HasManyThrough,
  hasMany,
  HasMany,
} from '@ioc:Adonis/Lucid/Orm'
import Role from './Role'
import UserRole from './UserRole'
import Permission from './Permission'

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

  @hasMany(() => UserRole)
  public userRoles: HasMany<typeof UserRole>

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

  public async addRoleByName(name: string) {
    const role = await Role.firstOrCreate({
      name,
    })

    await UserRole.updateOrCreate(
      {
        roleId: role.id,
        userId: this.id,
      },
      {
        roleId: role.id,
        userId: this.id,
      }
    )
  }

  public async haveRoles(rolesNames: string[]) {
    if (!this.roles) {
      await (this as User).load('roles')
    }

    return rolesNames.every((rn) => this.roles.some((r) => r.name === rn))
  }

  public async findPermissions() {
    const roles = await (this as User).related('roles').query().preload('permissions')

    return roles
      .map((r) => r.permissions)
      .reduce<Permission[]>((all, current) => all.concat(current), [])
  }
}
