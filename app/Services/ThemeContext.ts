import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'

import Space from './SpaceService'
import { UserSpace } from './UserSpace'

export class ThemeContext {
  public user?: Record<string, any>
  public response: HttpContextContract['response']
  public space: UserSpace
  public path: string
  public fullPath: string
  public query: Record<string, any>

  public static async mount({ auth, request, response }: HttpContextContract) {
    const instance = new this()
    instance.user = auth.user?.serialize()
    instance.response = response
    instance.path = request.url()
    instance.fullPath = request.url(true)
    instance.query = request.qs()

    await instance.setSpace()

    return instance
  }

  private async setSpace() {
    const allEvents = Array.from(Space.events.keys())
    const allowedEvents: string[] = allEvents

    this.space = new UserSpace(allowedEvents)
  }
}
