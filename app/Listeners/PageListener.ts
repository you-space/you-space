import SystemMeta from 'App/Models/SystemMeta'

interface PageDataFile {
  name?: string
  filename: string
  type: 'main' | 'css'
}

export interface PageData {
  name: string
  label?: string
  icon?: string
  files: PageDataFile[]
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
    const main = data.files.find((f) => f.type === 'main')

    if (!main) {
      throw new Error('Main file is required')
    }

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
