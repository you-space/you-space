import Space from 'App/Services/SpaceService'
import { Theme } from './ThemeListener'

export interface Page {
  id: number
  title: string
  filename: string
}

const pages: Page[] = []

export default class PageListener {
  public async index() {
    if (pages.length) {
      return pages
    }

    const themes = await Space.emit<Theme[]>('theme:index')

    if (!themes) {
      return pages
    }

    themes
      .filter((theme) => theme.active)
      .map((theme) =>
        (theme.dashboard?.pages || []).map((page) => ({
          ...page,
          filename: theme.makePath(page.path),
        }))
      )
      .reduce((all, current) => all.concat(current), [])
      .forEach((page) => {
        pages.push({
          id: pages.length,
          title: page.title,
          filename: page.filename,
        })
      })

    return pages
  }

  public async show(id: number) {
    const pages = await this.index()

    return pages.find((page) => page.id === id)
  }
}
