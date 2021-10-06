import SystemMeta from 'App/Models/SystemMeta'

export interface AssetData {
  name: string
  filename: string
}

export default class Asset {
  public async index() {
    const metas = await SystemMeta.fetchByName('assets:*')

    return metas.map((m) => m.toMetaObject())
  }

  public async find(name: string) {
    const metaName = `assets:${name}`

    const meta = await SystemMeta.findBy('name', metaName)

    return meta ? meta.toMetaObject() : null
  }
}
