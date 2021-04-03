import BaseSeeder from '@ioc:Adonis/Lucid/Seeder'
import Permission from 'App/Models/Permission'

export default class PermissionSeeder extends BaseSeeder {
  public async run() {
    await Permission.updateOrCreateMany('name', [
      { name: 'admin' },
      { name: 'view-private-videos' },
    ])
  }
}
