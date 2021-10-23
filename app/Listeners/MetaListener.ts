import SystemMeta from 'App/Models/SystemMeta'

export default class Meta {
  public async index(name: string) {
    const metas = await SystemMeta.fetchByName(name)

    return metas.map((m) => m.serialize())
  }

  public async show(name: string) {
    const meta = await SystemMeta.findBy('name', name)

    return meta ? meta.serialize().value : null
  }

  public async update(meta: any) {
    await SystemMeta.updateOrCreate({ name: meta.name }, meta)
  }

  public async updateAll(metas: Pick<SystemMeta, 'name' | 'value'>[]) {
    await SystemMeta.updateOrCreateMany('name', metas)
  }
}
