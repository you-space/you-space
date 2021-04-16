import { DateTime } from 'luxon'
import {
  BaseModel,
  column,
  computed,
  HasMany,
  hasMany,
  hasManyThrough,
  HasManyThrough,
  beforeDelete,
  beforeUpdate,
} from '@ioc:Adonis/Lucid/Orm'
import VisibilityPermission from './VisibilityPermission'
import Permission from './Permission'
import NotModifyDefaultEntityException from 'App/Exceptions/NotModifyDefaultEntityException'

export enum DefaultVisibilities {
  public = 'public',
  private = 'private',
}

export default class Visibility extends BaseModel {
  @column({ isPrimary: true })
  public id: number

  @column()
  public name: keyof typeof DefaultVisibilities | string

  @computed()
  public get isDefault() {
    return Object.values<string>(DefaultVisibilities).includes(this.name)
  }

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

  @beforeUpdate()
  @beforeDelete()
  public static async notModifyDefault(visibility: Visibility) {
    if (visibility.isDefault) {
      throw new NotModifyDefaultEntityException('Can not modify default visibilities')
    }
  }
}
