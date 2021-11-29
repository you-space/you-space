import { BaseCommand } from '@adonisjs/core/build/standalone'
import Role from 'App/Models/Role'
import User from 'App/Models/User'

export default class MakeUser extends BaseCommand {
  public static commandName = 'make:user'
  public static description = 'create a user in database'

  public static settings = {
    loadApp: true,
    stayAlive: false,
  }

  public async run() {
    const roles = (await Role.all()).map((role) => role.name)

    const username = await this.prompt.ask('username')
    const password = await this.prompt.secure('password')

    const userRoles = await this.prompt.multiple('roles', roles)

    const user = await User.create({
      username,
      password,
    })

    await Promise.all(userRoles.map((r) => user.addRoleByName(r)))
  }
}
