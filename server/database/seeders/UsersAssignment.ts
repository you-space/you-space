import BaseSeeder from '@ioc:Adonis/Lucid/Seeder'
import Role from 'App/Models/Role'
import User from 'App/Models/User'
import UserAssignment from 'App/Models/UserAssignment'

export default class UsersAssignmentSeeder extends BaseSeeder {
  public async run() {
    // Write your database queries inside the run method
    const role = await Role.firstOrCreate({
      name: 'admin',
    })

    const user = await User.firstOrCreate(
      { email: 'admin@ys.com' },
      { email: 'admin@ys.com', password: '123456' }
    )

    await UserAssignment.firstOrCreate({
      roleId: role.id,
      userId: user.id,
    })
  }
}
