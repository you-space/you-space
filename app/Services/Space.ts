import AdonisServer from '@ioc:Adonis/Core/Server'
import Logger from '@ioc:Adonis/Core/Logger'
import { Server, Socket } from 'socket.io'
import minimatch from 'minimatch'

import { getSocketUserId } from 'App/Helpers'
import User from 'App/Models/User'

interface SpaceEvent {
  name: string
  roles?: string[]
  handler: (...args: any[]) => Promise<any> | any
}

interface SpaceObserver {
  name: string
  handler: (...args: any[]) => Promise<any> | any
}

class Space {
  private io: Server
  private booted = false
  private events: SpaceEvent[] = []
  private observers: SpaceObserver[] = []

  public boot() {
    if (this.booted) {
      return
    }

    this.booted = true

    this.io = new Server(AdonisServer.instance, {
      path: '/api/v1/sockets',
    })

    this.io.on('connection', (socket) => this.connection(socket))

    Logger.info('[space] service started')
  }

  public subscribe(observer: SpaceObserver) {
    this.observers.push(observer)
  }

  public registerHandler(event: SpaceEvent) {
    const exist = this.events.find((e) => minimatch(e.name, event.name))

    if (exist) {
      Logger.error('[space] event handler already exist')
      return
    }

    this.events.push(event)

    Logger.debug('[space] register handler: %s', event.name)
  }

  private async connection(socket: Socket) {
    Logger.debug('[space] socket connected: %s', socket.id)

    this.events.forEach(async (event) => {
      socket.on(event.name, async (...args: any[]) => {
        Logger.debug('[space] event emitted: %s', event.name)

        const callback = args.pop()

        const result = await event.handler(...args)

        callback(result)

        this.observers
          .filter((o) => minimatch(event.name, o.name))
          .forEach((o) => o.handler(...args))
      })
    })
  }

  public async emit<T = any>(name: string, ...args: any[]) {
    this.nativeEmit(name, ...args)
    // send event to clients
    name.split(':').forEach((n, index, array) => {
      const newArray = array.slice()
      newArray[index] = '*'
      this.nativeEmit(newArray.join(':'), ...args)
    })

    this.observers.filter((o) => minimatch(name, o.name)).forEach((o) => o.handler(...args))

    const event = this.events.find((e) => minimatch(name, e.name))

    let result: T | null = null

    Logger.debug('[space] event emitted: %s', name)

    if (event) {
      result = await event.handler(...args)
    }

    return result
  }

  public nativeOn: Server['on'] = (...args) => {
    return this.io.on(...args)
  }

  public nativeEmit: Server['emit'] = (...args) => {
    return this.io.emit(...args)
  }
}

export default new Space()
