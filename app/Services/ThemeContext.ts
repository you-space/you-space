import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import VideoListener from 'App/Listeners/VideoListener'

export class ThemeContext {
  public user?: Record<string, any>
  public permissions: string[] = []

  public response: HttpContextContract['response']

  public videos: Record<string, any> = {}
  public path: string
  public fullPath: string
  public query: Record<string, any>

  public static async mount({ auth, request, response }: HttpContextContract) {
    const instance = new this()

    instance.response = response
    instance.path = request.url()
    instance.fullPath = request.url(true)
    instance.query = request.qs()

    if (auth.user) {
      instance.user = auth.user.serialize()
      instance.permissions = (await auth.user.findPermissions()).map((p) => p.name)
    }

    const listener = new VideoListener(instance.permissions)

    instance.videos = {
      index: listener.index.bind(listener),
      show: listener.show.bind(listener),
    }

    return instance
  }
}
