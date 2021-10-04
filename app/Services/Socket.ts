import AdonisServer from '@ioc:Adonis/Core/Server'
import Logger from '@ioc:Adonis/Core/Logger'
import { Server, Socket as IoSocket } from 'socket.io'

import { getSocketUserId } from 'App/Helpers'
import User from 'App/Models/User'
import Space from './Space'

class Socket {
  private io: Server
  private booted = false

  public boot() {
    if (this.booted) {
      return
    }

    this.booted = true

    this.io = new Server(AdonisServer.instance, {
      path: '/api/v1/sockets',
    })

    this.io.use(this.middleware)

    this.io.on('connection', (socket) => this.connection(socket))

    Logger.info('[sockets] service started')
  }

  public async middleware(socket: IoSocket, next: () => void) {
    const id = getSocketUserId(socket)
    const user = await User.query().where('id', id).preload('roles').first()

    socket.data.user = user
    socket.data.roles = user ? user.roles.map((r) => r.name) : []

    next()
  }

  private async connection(socket: IoSocket) {
    Logger.debug('[sockets] socket connected: %s', socket.id)

    const roles: string[] = socket.data.roles || []

    const events = Space.fetchHandlers()

    Space.onAny((event) => {
      let allow = true

      if (event.handler && event.handler.roles) {
        allow = event.handler.roles.every((r) => roles.includes(r))
      }

      if (allow) {
        socket.emit(event.event, event.args)
      }
    })

    events.forEach((event) => {
      socket.on(event.name, async (...args: any[]) => {
        const callback = args.pop()

        Space.roles = roles

        await Space.emit(event.name, ...args)
          .then((result) => callback(null, result))
          .catch((err) => callback(err.message))

        Space.roles = ['*']
      })
    })
  }
}

export default new Socket()
