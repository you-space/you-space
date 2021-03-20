import BaseSeeder from '@ioc:Adonis/Lucid/Seeder'
import { v4 as uuid } from 'uuid'

import Origin, { OriginTypes } from 'App/Models/Origin'
import Role from 'App/Models/Role'
import User from 'App/Models/User'
import UserAssignment from 'App/Models/UserAssignment'

export default class UsersAssignmentSeeder extends BaseSeeder {
  public async run() {
    const originMain = await Origin.firstOrCreate({
      name: 'main',
      type: OriginTypes.Main,
    })
    // Write your database queries inside the run method
    const role = await Role.firstOrCreate({
      name: 'admin',
    })

    const user = await User.firstOrCreate(
      { username: 'admin' },
      {
        id: `${originMain.id}-${uuid()}`,
        username: 'admin',
        password: '123456',
        originId: originMain.id,
      }
    )

    await UserAssignment.firstOrCreate({
      roleId: role.id,
      userId: user.id,
    })
  }
}
