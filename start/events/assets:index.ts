import SystemMeta from 'App/Models/SystemMeta'

export default {
  roles: ['admin'],
  handler: async () => {
    const metas = await SystemMeta.fetchByName('space:assets:*')

    return metas.map((m) => m.toMetaObject())
  },
}
