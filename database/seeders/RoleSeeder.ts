import BaseSeeder from '@ioc:Adonis/Lucid/Seeder'
import Permission from 'App/Models/Permission'
import Role from 'App/Models/Role'
import RolePermission from 'App/Models/RolePermission'

export default class PermissionSeeder extends BaseSeeder {
  public async run() {
    const permissions = await Permission.updateOrCreateMany('name', [
      { name: 'admin' },
      { name: 'view-private-items' },
    ])

    const role = await Role.firstOrCreate({
      name: 'admin',
    })

    await RolePermission.updateOrCreateMany(
      ['roleId', 'permissionId'],
      permissions.map((p) => ({
        permissionId: p.id,
        roleId: role.id,
      }))
    )
  }
}
