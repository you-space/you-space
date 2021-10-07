import SystemMeta from 'App/Models/SystemMeta'

export default class Meta {
  public async index(name: string) {
    const metas = await SystemMeta.fetchByName(name)

    return metas.map((m) => m.serialize())
  }

  public async find(name: string) {
    const meta = await SystemMeta.findBy('name', name)

    return meta ? meta.value : null
  }

  public create() {}

  public update() {}

  public async updateAll(metas: Pick<SystemMeta, 'name' | 'value'>[]) {
    await SystemMeta.updateOrCreateMany('name', metas)
  }

  public delete() {}
}
