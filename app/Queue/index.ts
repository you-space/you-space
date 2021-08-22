import Bull from 'bull'
import Logger from '@ioc:Adonis/Core/Logger'

export interface QueueHandler {
  name: string
  handler: Bull.ProcessCallbackFunction<any>
  bull: Bull.Queue
}

export default class Queue {
  public queues: QueueHandler[] = []

  constructor() {
    Logger.info('queue service started')
  }

  public findQueue(name: string) {
    const queue = this.queues.find((q) => q.name === name)

    return queue ? queue.bull : null
  }

  public addQueue<T = Record<string, any>>(
    name: string,
    callback: Bull.ProcessCallbackFunction<T>
  ) {
    const queue = new Bull(name)

    queue.process(callback)

    this.queues.push({
      name,
      handler: callback,
      bull: queue,
    })

    return queue
  }
}
