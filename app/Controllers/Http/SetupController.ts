import fs from 'fs'

import execa from 'execa'

import Application from '@ioc:Adonis/Core/Application'
import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'

import { string } from '@ioc:Adonis/Core/Helpers'

import SetupValidator from 'App/Validators/SetupValidator'
import Env from '@ioc:Adonis/Core/Env'
import Database from '@ioc:Adonis/Lucid/Database'
import User from 'App/Models/User'
import Space from 'App/Services/SpaceService'
export default class SetupsController {
  public async show({ response }: HttpContextContract) {
    const setupHtml = Application.makePath('resources', 'setup.html')

    response.type('text/html')

    return fs.promises.readFile(setupHtml)
  }

  public async store({ request, response }: HttpContextContract) {
    const envPath = Application.makePath('.env')

    const { database, user } = await request.validate(SetupValidator)

    if (fs.existsSync(envPath)) {
      return response.badRequest({
        errors: [
          {
            message: 'Setup already done',
          },
        ],
      })
    }

    Database.manager.patch('primary', {
      client: 'pg',
      connection: database,
      healthCheck: true,
    })

    const databaseStatus = await Database.manager.report()

    if (!databaseStatus.health.healthy) {
      return response.badRequest({
        errors: [
          {
            message: 'error in database connection',
          },
        ],
      })
    }

    const variables: [string, string | number][] = [
      ['NODE_ENV', Env.get('NODE_ENV', 'production')],
      ['APP_KEY', Env.get('APP_KEY', string.generateRandom(32))],
      ['APP_URL', Env.get('APP_URL', 'http://localhost:3333')],
      ['PG_HOST', database.host],
      ['PG_PORT', database.port],
      ['PG_USER', database.user],
      ['PG_PASSWORD', database.password],
      ['PG_DB_NAME', database.database],
    ]

    variables.forEach(([name, value]) => Env.set(name, value))

    const content = variables.map((v) => v.join('=')).join('\n')

    await fs.promises.writeFile(envPath, content)

    await execa.node('ace', ['migration:run', '--force'], {
      stdio: 'inherit',
    })

    await execa.node('ace', ['db:seed'], {
      stdio: 'inherit',
    })

    const admin = await User.create({
      username: user.username,
      password: user.password,
    })

    await admin.addRoleByName('admin')

    await Space.emit('asset:store', {
      name: 'space',
      filename: Application.resourcesPath('space.js'),
    })

    response.json({
      message: 'setup ready',
    })

    process.exit(1)
  }
}
