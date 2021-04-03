import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import Database from '@ioc:Adonis/Lucid/Database'
import Permission from 'App/Models/Permission'

import Visibility from 'App/Models/Visibility'
import VisibilityPermission from 'App/Models/VisibilityPermission'
import VisibilityValidator from 'App/Validators/VisibilityValidator'

export default class VisibilitiesController {
  public async index() {
    return Visibility.query().preload('requiredPermissions')
  }

  public async store({ request }: HttpContextContract) {
    const { name, requiredPermissionIds } = await request.validate(VisibilityValidator)

    const permissions = await Permission.query().whereIn('id', requiredPermissionIds)

    if (permissions.length !== requiredPermissionIds.length) {
      throw new Error('one or more permissions are invalid')
    }

    const visibility = new Visibility()

    const visibilityPermissions = requiredPermissionIds.map((id) => {
      const visibilityPermissions = new VisibilityPermission()
      visibilityPermissions.permissionId = id
      return visibilityPermissions
    })

    visibility.name = name

    await visibility.related('visibilityPermissions').saveMany(visibilityPermissions)

    return visibility
  }

  public async show({ params }: HttpContextContract) {
    return Visibility.query().preload('requiredPermissions').where('id', params.id).firstOrFail()
  }

  public async update({ params, request }: HttpContextContract) {
    const { name, requiredPermissionIds } = await request.validate(VisibilityValidator)
    const visibility = await Visibility.findOrFail(params.id)

    const permissions = await Permission.query().whereIn('id', requiredPermissionIds)

    if (permissions.length !== requiredPermissionIds.length) {
      throw new Error('one or more permissions are invalid')
    }

    const trx = await Database.transaction()

    visibility.useTransaction(trx)

    visibility.name = name

    await visibility.save()

    await visibility.related('visibilityPermissions').query().delete()

    await visibility.related('visibilityPermissions').createMany(
      requiredPermissionIds.map((id) => ({
        permissionId: id,
      }))
    )

    await trx.commit()

    return visibility
  }

  public async destroy({ params }: HttpContextContract) {
    const visibility = await Visibility.findOrFail(params.id)

    await visibility.delete()
  }
}
