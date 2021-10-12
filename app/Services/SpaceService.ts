import Logger from '@ioc:Adonis/Core/Logger'

interface Callback {
  (data: any): void | Promise<void>
}

interface OnAnyCallback {
  (event: string, data: any): void | Promise<void>
}

interface Handler {
  (data: any): any | Promise<any>
}

interface Observer {
  event: string
  callback: Callback
}

export class SpaceService {
  private observers: Observer[] = []
  private onAnyObservers: OnAnyCallback[] = []
  private events: Map<string, Handler> = new Map()

  constructor() {
    global.space = this
    Logger.info('[space] service started')
  }

  public setHandler(event: string, handler: Handler) {
    Logger.debug('[space] %s event handler defined', event)
    this.events.set(event, handler)
  }

  public findEvent(name: string) {
    return this.events.get(name) || null
  }

  public notifyAll(event: string, data: any) {
    this.observers.filter((o) => o.event === event).forEach((o) => o.callback(data))

    this.onAnyObservers.forEach((callback) => callback(event, data))

    event.split(':').forEach((current) => {
      const currentName = event.replace(current, '*')

      this.observers.filter((o) => o.event === currentName).forEach((o) => o.callback(data))

      this.onAnyObservers.forEach((callback) => callback(currentName, data))
    })
  }

  public on(event: string, callback: Callback) {
    this.observers.push({
      event,
      callback,
    })
  }

  public onAny(callback: OnAnyCallback) {
    this.onAnyObservers.push(callback)
  }

  public offAll() {
    this.events.clear()
  }

  public async emit<T = null>(event: string, data?: any) {
    const handler = this.events.get(event)

    let result: T | null = null

    if (handler) {
      result = await handler(data)
    }

    this.notifyAll(event, data)

    return result
  }
}

export const Space = new SpaceService()

export default Space
