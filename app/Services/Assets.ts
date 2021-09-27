// assets manager

import SystemMeta from 'App/Models/SystemMeta'

class Assets {
  public findAll() {}

  public async create(name: string, filename: string) {
    const metaName = `assets:${name}`

    await SystemMeta.updateOrCreate({ name: metaName }, { name: metaName, value: filename })
  }

  public async delete(name: string) {
    const metaName = `assets:${name}`
    const meta = await SystemMeta.fetchByName(metaName).first()

    if (meta) {
      await meta.delete()
    }
  }
}

export const assets = new Assets()
