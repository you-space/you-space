import { DateTime } from 'luxon'
import { BaseModel, column, HasManyThrough, hasManyThrough } from '@ioc:Adonis/Lucid/Orm'
import Permission from './Permission'
import RolePermission from './RolePermission'

export default class Role extends BaseModel {
  @column({ isPrimary: true })
  public id: number

  @column()
  public name: string

  @hasManyThrough([() => Permission, () => RolePermission], {
    foreignKey: 'roleId',
    throughLocalKey: 'roleId',
    throughForeignKey: 'id',
  })
  public permissions: HasManyThrough<typeof Permission>

  @column.dateTime({ autoCreate: true })
  public createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  public updatedAt: DateTime
}
