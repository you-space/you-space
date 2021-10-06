import AdonisServer from '@ioc:Adonis/Core/Server'
import Logger from '@ioc:Adonis/Core/Logger'
import { Server, Socket as IoSocket } from 'socket.io'

import { getSocketUserId } from 'App/Helpers'
import User from 'App/Models/User'
import Space from './Space'

interface SocketCallback {
  (err: string | null, result?: any): void
}

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

    Space.onAny((event, data) => {
      socket.emit(event, data)
    })

    socket.onAny((event: string, data: any, callback?: SocketCallback) => {
      return Space.emit(event, data)
        .then((result) => (callback ? callback(null, result) : null))
        .catch((err) => (callback ? callback(err.message) : null))
    })
  }
}

export default new Socket()
