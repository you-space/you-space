import fs from 'fs'
import { promisify } from 'util'

import Application from '@ioc:Adonis/Core/Application'
import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import File from 'App/Models/File'

export default class FilesController {
  public async show({ params, response }: HttpContextContract) {
    const file = await File.findOrFail(params.id)

    response.safeHeader('Content-type', `${file.type}/${file.extname}`)

    return response.attachment(file.filepath)
  }

  public async showStatic() {}
}
