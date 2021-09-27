import SystemMeta from 'App/Models/SystemMeta'

class Service {
  public async create(name: string, filename: string) {
    const metaName = `pages:${name}`

    await SystemMeta.updateOrCreate({ name: metaName }, { name: metaName, value: filename })
  }
}

export const pages = new Service()
