import Logger from '@ioc:Adonis/Core/Logger'
import minimatch from 'minimatch'

interface SpaceEventCallback {
  (...args: any[]): Promise<any> | any
}

interface SpaceEventHandler {
  name: string
  roles?: string[]
  handler: SpaceEventCallback
}

interface SpaceObserver {
  name: string
  callback: SpaceEventCallback
}

interface GlobalObserverData {
  event: string
  handler?: SpaceEventHandler
  args: any[]
  result?: any
}

interface GlobalObserver {
  (data: GlobalObserverData): void | Promise<void>
}

class Space {
  private eventHandlers: SpaceEventHandler[] = []
  private observers: SpaceObserver[] = []
  private globalObservers: GlobalObserver[] = []

  public roles = ['*']

  public fetchHandlers() {
    return this.eventHandlers
  }

  public registerHandler(event: SpaceEventHandler) {
    const exist = this.eventHandlers.find((e) => minimatch(e.name, event.name))

    if (exist) {
      Logger.error('[space] event handler already exist')
      return
    }

    this.eventHandlers.push(event)

    Logger.debug('[space] register handler: %s', event.name)
  }

  public async emit<T = any>(eventName: string, ...args: any[]) {
    const subEvents = eventName.split(':').reduce(
      (result, _, index) => {
        const newArray = eventName.split(':').slice()

        newArray[index] = '*'

        return result.concat(newArray.join(':'))
      },
      [eventName]
    )

    const eventHandler = this.eventHandlers.find((e) => minimatch(eventName, e.name))

    let allow = true

    if (eventHandler && eventHandler.roles) {
      allow = eventHandler.roles.some((r) => this.roles.includes(r))
    }

    if (!allow && !this.roles.includes('*')) {
      return Promise.reject(new Error('Not Allowed'))
    }

    let result: T | null = null

    Logger.debug('[space] event emitted: %s', eventName)

    if (eventHandler) {
      result = await eventHandler.handler(...args)
    }

    subEvents.forEach((event) => {
      this.observers.filter((o) => minimatch(event, o.name)).forEach((o) => o.callback(...args))

      this.globalObservers.forEach((observer) => {
        observer({
          event: event,
          handler: eventHandler,
          result,
          args,
        })
      })
    })

    return result
  }

  public on(event: string, callback: (...args: any[]) => void | Promise<void>) {
    this.observers.push({
      name: event,
      callback,
    })
  }

  public onAny(observer: GlobalObserver) {
    this.globalObservers.push(observer)
  }
}

export default new Space()
