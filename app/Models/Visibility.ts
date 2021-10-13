import { DateTime } from 'luxon'
import {
  BaseModel,
  column,
  HasMany,
  hasMany,
  hasManyThrough,
  HasManyThrough,
} from '@ioc:Adonis/Lucid/Orm'
import VisibilityPermission from './VisibilityPermission'
import Permission from './Permission'

export default class Visibility extends BaseModel {
  @column({ isPrimary: true })
  public id: number

  @column()
  public name: string

  @hasMany(() => VisibilityPermission)
  public visibilityPermissions: HasMany<typeof VisibilityPermission>

  @hasManyThrough([() => Permission, () => VisibilityPermission], {
    foreignKey: 'visibilityId',
    throughForeignKey: 'id',
    throughLocalKey: 'permissionId',
  })
  public permissions: HasManyThrough<typeof Permission>

  @column.dateTime({ autoCreate: true })
  public createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  public updatedAt: DateTime
}
