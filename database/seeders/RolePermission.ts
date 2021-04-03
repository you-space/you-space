import BaseSeeder from '@ioc:Adonis/Lucid/Seeder'
import Permission from 'App/Models/Permission'
import RolePermission from 'App/Models/RolePermission'
import Role from 'App/Models/Role'

export default class RolePermissionSeeder extends BaseSeeder {
  public async run() {
    // Write your database queries inside the run method
    const role = await Role.firstOrCreate({
      name: 'admin',
    })

    const permission = await Permission.all()
    const rolePermissions = permission.map((p) => ({
      permissionId: p.id,
      roleId: role.id,
    }))

    await Promise.all(rolePermissions.map(async (rp) => RolePermission.firstOrCreate(rp)))
  }
}
