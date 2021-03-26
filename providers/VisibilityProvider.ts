import { ApplicationContract } from '@ioc:Adonis/Core/Application'
import UnAuthorizedException from 'App/Exceptions/UnAuthorizedException'
import Permission from 'App/Models/Permission'
import User from 'App/Models/User'
import Visibility from 'App/Models/Visibility'

export default class VisibilityProvider {
  public static needsApplication = true
  constructor(protected application: ApplicationContract) {}

  public register() {
    this.application.container.singleton('Providers/Visibility', () => this)
  }

  public async isAllowedToView(visibility: Visibility, user?: User) {
    if (visibility.name === 'public') {
      return true
    }

    if (!user) {
      throw new UnAuthorizedException('Not allowed to see data')
    }

    const requiredPermission = ['admin']

    const roles = await user.related('roles').query().preload('permissions')

    const userPermissions = roles
      .map((r) => r.permissions)
      .reduce<Permission[]>((all, p) => all.concat(p), [])
      .map((p) => p.name)

    if (!requiredPermission.every((p) => userPermissions.includes(p))) {
      throw new UnAuthorizedException('Not allowed to see data')
    }
  }
}
