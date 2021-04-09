import AdonisServer from '@ioc:Adonis/Core/Server'
import AuthenticateByTokenService from '@ioc:Providers/AuthenticateByTokenService'
import Permission from 'App/Models/Permission'

import { Server, Socket } from 'socket.io'

export default class SocketService {
  public io: Server

  public async userHavePermission(token: string, permissions: string[]) {
    const user = await AuthenticateByTokenService.authenticate(token)

    if (!user) {
      return false
    }

    const roles = await user.related('roles').query().preload('permissions')

    const usersPermission = roles
      .map((r) => r.permissions)
      .reduce<Permission[]>((all, p) => all.concat(p), [])
      .map((p) => p.name)

    return permissions.every((rp) => usersPermission.includes(rp))
  }

  public start() {
    this.io = new Server(AdonisServer.instance!, {
      path: '/api/sockets',
    })

    this.io.of('/admin').on('connection', async (socket: Socket) => {
      const token = socket.handshake.auth.token
      const allowed = await this.userHavePermission(token, ['admin'])

      if (!allowed) {
        return socket.disconnect()
      }
    })
  }
}
