import BaseSeeder from '@ioc:Adonis/Lucid/Seeder'
import Permission from 'App/Models/Permission'
import PermissionsAssignment from 'App/Models/PermissionsAssignment'
import Role from 'App/Models/Role'

export default class PermissionsAssignmentSeeder extends BaseSeeder {
  public async run() {
    // Write your database queries inside the run method
    const role = await Role.firstOrCreate({
      name: 'admin',
    })

    const permission = await Permission.firstOrCreate({
      name: 'admin',
    })

    await PermissionsAssignment.firstOrCreate({
      roleId: role.id,
      permissionId: permission.id,
    })
  }
}
