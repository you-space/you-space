import path from 'path'
import fs from 'fs'
import { promisify } from 'util'
import Application from '@ioc:Adonis/Core/Application'
import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import SystemMeta, { SystemDefaults } from 'App/Models/SystemMeta'
import Theme from 'App/Extensions/Theme'

export default class ClientController {
  public async show({ request }: HttpContextContract) {
    const meta = await SystemMeta.firstOrCreate({
      name: SystemDefaults.CurrentTheme,
    })

    const theme = await Theme.find(meta.value)

    if (!theme) {
      return 'No theme was defined'
    }

    console.log(theme, theme.assets)

    // const content = await theme.render(request.url(true))

    // return content
  }
}
