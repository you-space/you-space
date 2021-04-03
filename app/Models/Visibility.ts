import { DateTime } from 'luxon'
import {
  BaseModel,
  column,
  HasMany,
  hasMany,
  hasManyThrough,
  HasManyThrough,
  beforeDelete,
} from '@ioc:Adonis/Lucid/Orm'
import Video from './Video'
import VisibilityPermission from './VisibilityPermission'
import Permission from './Permission'

export enum DefaultVisibilities {
  public = 'public',
  private = 'private',
}

export default class Visibility extends BaseModel {
  @column({ isPrimary: true })
  public id: number

  @column()
  public name: keyof typeof DefaultVisibilities | string

  @hasMany(() => Video)
  public videos: HasMany<typeof Video>

  @hasMany(() => VisibilityPermission)
  public visibilityPermissions: HasMany<typeof VisibilityPermission>

  @hasManyThrough([() => Permission, () => VisibilityPermission], {
    foreignKey: 'visibilityId',
    throughForeignKey: 'id',
    throughLocalKey: 'permissionId',
  })
  public requiredPermissions: HasManyThrough<typeof Permission>

  @column.dateTime({ autoCreate: true })
  public createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  public updatedAt: DateTime

  @beforeDelete()
  public static async beforeDelete(visibility: Visibility) {
    await visibility.related('visibilityPermissions').query().delete()
  }
}
