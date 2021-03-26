import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import UnAuthorizedException from 'App/Exceptions/UnAuthorizedException'
import Permission from 'App/Models/Permission'

export default class Acl {
  public async handle(
    { auth }: HttpContextContract,
    next: () => Promise<void>,
    permissions: string[]
  ) {
    const { user } = auth
    if (!user) {
      throw new UnAuthorizedException('Not allowed')
    }

    const roles = await user.related('roles').query().preload('permissions')

    const userPermissions = roles
      .map((r) => r.permissions)
      .reduce<Permission[]>((all, p) => all.concat(p), [])
      .map((p) => p.name)

    if (!permissions.every((p) => userPermissions.includes(p))) {
      throw new UnAuthorizedException('Not allowed')
    }
    await next()
  }
}
