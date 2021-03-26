import BaseSeeder from '@ioc:Adonis/Lucid/Seeder'
import Permission from 'App/Models/Permission'

export default class PermissionSeeder extends BaseSeeder {
  public async run() {
    // Write your database queries inside the run method
    await Permission.updateOrCreateMany('name', [{ name: 'admin' }])
  }
}
