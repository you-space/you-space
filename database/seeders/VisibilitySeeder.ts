import BaseSeeder from '@ioc:Adonis/Lucid/Seeder'
import Permission from 'App/Models/Permission'
import Visibility from 'App/Models/Visibility'

export default class VisibilitySeeder extends BaseSeeder {
  public async run() {
    const permission = await Permission.firstOrCreate({
      name: 'view-private-items',
    })

    await Visibility.firstOrCreate({
      name: 'public',
    })

    const privateVisibility = await Visibility.firstOrCreate({
      name: 'private',
    })

    await privateVisibility
      .related('visibilityPermissions')
      .updateOrCreate({ permissionId: permission.id }, { permissionId: permission.id })
  }
}
