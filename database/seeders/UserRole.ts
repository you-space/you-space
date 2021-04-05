import BaseSeeder from '@ioc:Adonis/Lucid/Seeder'
import { v4 as uuid } from 'uuid'

import Role from 'App/Models/Role'
import User from 'App/Models/User'
import UserRole from 'App/Models/UserRole'
import OriginMain from '@ioc:Providers/OriginMainProvider'

export default class UserRolesSeeder extends BaseSeeder {
  public async run() {
    // Write your database queries inside the run method
    const role = await Role.firstOrCreate({
      name: 'admin',
    })

    const user = await User.firstOrCreate(
      { username: 'admin' },
      {
        id: `${OriginMain.id}-${uuid()}`,
        username: 'admin',
        password: '123456',
        originId: OriginMain.id,
      }
    )

    await UserRole.firstOrCreate({
      roleId: role.id,
      userId: user.id,
    })
  }
}
