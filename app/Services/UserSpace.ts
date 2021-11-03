import Space from './SpaceService'

export class UserSpace {
  constructor(private allowEvents: string[] = []) {}

  public emit(event: string, data: any) {
    if (!this.allowEvents.includes(event)) {
      throw new Error(`Event ${event} is not allowed for user`)
    }
    return Space.emit(event, data)
  }
}
