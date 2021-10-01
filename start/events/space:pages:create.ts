import SystemMeta from 'App/Models/SystemMeta'

export interface Page {
  name: string
  template: string
  script?: string
  styles?: string
  label?: string
  icon?: string
}

export default {
  handler: async (page: Page) => {
    const name = `space:pages:${page.name}`

    return await SystemMeta.firstOrCreateMetaObject(name, page)
  },
}
