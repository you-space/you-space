import path from 'path'
import fs from 'fs'
import { promisify } from 'util'
import Application from '@ioc:Adonis/Core/Application'
import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import SystemMeta, { SystemDefaults } from 'App/Models/SystemMeta'

export default class ClientController {
  public async show({ request, response }: HttpContextContract) {
    const staticTypes = {
      js: 'text/javascript',
      map: 'text/javascript',
      css: 'text/css',
      png: 'image/png',
      ico: 'image/x-icon',
    }

    const filename = request.url()
    const extname = path.extname(request.url()).replace('.', '')
    const currentTheme = await SystemMeta.findBy('name', SystemDefaults.CurrentTheme)

    if (!currentTheme || !currentTheme.value) {
      throw new Error('theme not defined')
    }

    const themePath = Application.makePath('content', 'themes', currentTheme.value, 'index.js')

    const exists = await promisify(fs.exists)(themePath)

    if (!exists) {
      throw new Error('theme not found or was deleted')
    }

    const theme = require(themePath)

    let themeFiles = {}

    if (theme.staticFiles) {
      themeFiles = theme.staticFiles()
    }

    if (staticTypes[extname] && Object.keys(themeFiles).includes(filename)) {
      response.safeHeader('Content-type', staticTypes[extname])

      return await promisify(fs.readFile)(themeFiles[filename])
    }

    return theme.render({ request, response })
  }
}
