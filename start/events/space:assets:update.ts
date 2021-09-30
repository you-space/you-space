import SystemMeta from 'App/Models/SystemMeta'

interface Asset {
  name: string
  filename: string
}

export default {
  handler: async (asset: Asset) => {
    const name = `space:assets:${asset.name}`

    return await SystemMeta.updateOrCreateMetaObject(name, asset)
  },
}
