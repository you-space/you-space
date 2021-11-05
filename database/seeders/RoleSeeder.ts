import BaseSeeder from '@ioc:Adonis/Lucid/Seeder'
import Permission from 'App/Models/Permission'
import Role from 'App/Models/Role'
import RolePermission from 'App/Models/RolePermission'

export default class PermissionSeeder extends BaseSeeder {
  public async run() {
    const permission = await Permission.findByOrFail('name', 'admin')

    const role = await Role.firstOrCreate({ name: 'admin' })

    await RolePermission.firstOrCreate({
      permissionId: permission.id,
      roleId: role.id,
    })
  }
}
