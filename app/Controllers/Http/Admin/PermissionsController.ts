// import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'

import Permission from 'App/Models/Permission'

export default class PermissionsController {
  public async index() {
    return await Permission.all()
  }
}
