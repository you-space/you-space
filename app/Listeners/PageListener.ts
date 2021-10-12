import SystemMeta from 'App/Models/SystemMeta'

export interface PageData {
  name: string
  filename: string
  label?: string
  icon?: string
}

export default class Page {
  public async index() {
    const metas = await SystemMeta.fetchByName('pages:*')

    return metas.map((m) => m.toMetaObject())
  }

  public async show(name: string) {
    const metaName = `pages:${name}`

    const meta = await SystemMeta.findBy('name', metaName)

    return meta ? meta.toMetaObject() : null
  }

  public async store(data: PageData) {
    const metaName = `pages:${data.name}`

    return await SystemMeta.firstOrCreateMetaObject(metaName, data)
  }

  public async destroy(name: string) {
    const metaName = `pages:${name}`

    const meta = await SystemMeta.findBy('name', metaName)

    if (meta) {
      await meta.delete()
    }
  }
}
