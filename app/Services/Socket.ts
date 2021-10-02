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

    this.io.on('connection', (socket) => this.connection(socket))

    Space.onAny((event) => {
      this.io.emit(event.event, event.args)
    })

    Logger.info('[sockets] service started')
  }

  private async connection(socket: IoSocket) {
    Logger.debug('[sockets] socket connected: %s', socket.id)

    const events = Space.fetchHandlers()

    events.forEach((event) => {
      socket.on(event.name, async (...args: any[]) => {
        const callback = args.pop()

        const result = await Space.emit(event.name, ...args)

        callback(result)
      })
    })
  }
}

export default new Socket()
