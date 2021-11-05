import BaseSeeder from '@ioc:Adonis/Lucid/Seeder'
import Permission from 'App/Models/Permission'

export default class PermissionSeederSeeder extends BaseSeeder {
  public async run() {
    await Permission.updateOrCreateMany('name', [
      {
        name: 'admin',
        description: 'Administrator',
      },
      {
        name: 'visibility:public',
        description: 'Used to define visibility of videos',
      },
      {
        name: 'visibility:private',
        description: 'Used to define visibility of videos',
      },
    ])
  }
}
