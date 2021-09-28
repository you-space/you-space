import SystemMeta from 'App/Models/SystemMeta'

export interface Page {
  name: string
  filename: string
  label?: string
  icon?: string
}

class Service {
  public async create(page: Page) {
    const metaName = `pages:${page.name}`

    await SystemMeta.updateOrCreateMetaObject(metaName, page)
  }
}

export const pages = new Service()
