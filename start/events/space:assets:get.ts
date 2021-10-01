import SystemMeta from 'App/Models/SystemMeta'

export default {
  handler: async (assetName: string) => {
    const name = `space:assets:${assetName}`

    const meta = await SystemMeta.findBy('name', name)

    return meta ? meta.toMetaObject() : null
  },
}
