import SystemMeta from 'App/Models/SystemMeta'

export default class ProviderManager {
  public async create(name: string, filename: string) {
    const metaName = `providers:${name}`

    await SystemMeta.updateOrCreate(
      {
        name: metaName,
      },
      {
        name: metaName,
        value: filename,
      }
    )
  }

  public async delete(name: string) {
    const metaName = `providers:${name}`

    const meta = await SystemMeta.findBy('name', metaName)

    if (meta) {
      await meta.delete()
    }
  }
}
