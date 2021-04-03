import BaseSeeder from '@ioc:Adonis/Lucid/Seeder'
import Permission from 'App/Models/Permission'
import Visibility from 'App/Models/Visibility'
import VisibilityPermission from 'App/Models/VisibilityPermission'

export default class VisibilityPermissionSeeder extends BaseSeeder {
  public async run() {
    const privateVisibility = await Visibility.firstOrCreate({
      name: 'private',
    })

    const permission = await Permission.firstOrCreate({
      name: 'view-private-videos',
    })

    const visibilityPermissions = {
      visibilityId: privateVisibility.id,
      permissionId: permission.id,
    }

    await VisibilityPermission.firstOrCreate(visibilityPermissions)
  }
}
