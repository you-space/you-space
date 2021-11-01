import Application from '@ioc:Adonis/Core/Application'
import path from 'path'
import fs from 'fs'

class ContentService {
  public basePath = Application.makePath('content')

  constructor() {
    const contentPath = Application.env.get('CONTENT_PATH')

    if (contentPath) {
      this.basePath = contentPath
    }
  }

  public async start() {
    const defaultPaths = [
      this.makePath('themes'),
      this.makePath('plugins'),
      this.makePath('uploads'),
    ]

    await Promise.all(
      defaultPaths.map(async (path) => {
        const exists = await this.exists(path)

        if (!exists) {
          await fs.promises.mkdir(path, { recursive: true })
        }
      })
    )
  }

  public async exists(...args: string[]) {
    return fs.promises
      .access(this.makePath(...args), fs.constants.F_OK)
      .then(() => true)
      .catch(() => false)
  }

  public makePath(...args: string[]) {
    return path.join(this.basePath, ...args)
  }
}

export const Content = new ContentService()

export default Content
