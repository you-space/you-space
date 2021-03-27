import fs from 'fs'
import { promisify } from 'util'

import Application from '@ioc:Adonis/Core/Application'
import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import File from 'App/Models/File'

export default class FilesController {
  public async embed({ params, response }: HttpContextContract) {
    const file = await File.findOrFail(params.id)

    const readFile = promisify(fs.readFile)

    const videoPath = `${Application.tmpPath('uploads')}/${file.filename}`

    response.safeHeader('Content-type', `video/${file.extname}`)

    return readFile(videoPath)
  }

  public async showFile({ params, response }: HttpContextContract) {
    const file = await File.findOrFail(params.id)

    const readFile = promisify(fs.readFile)

    const path = `${Application.tmpPath('uploads')}/${file.filename}`

    response.safeHeader('Content-type', `${file.type}/${file.extname}`)

    return readFile(path)
  }

  public async showStatic() {}
}
