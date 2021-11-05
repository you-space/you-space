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
    throughForeignKey: 'id',
    throughLocalKey: 'permissionId',
  })
  public permissions: HasManyThrough<typeof Permission>
}
