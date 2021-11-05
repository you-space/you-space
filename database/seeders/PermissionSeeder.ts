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
        name: 'basic',
        description: 'Basic user',
      },
    ])
  }
}
