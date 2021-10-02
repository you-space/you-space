import SystemMeta from 'App/Models/SystemMeta'

export default {
  roles: ['admin'],
  handler: async (patter: string) => {
    const metas = await SystemMeta.fetchByName(patter)

    return metas.map((m) => m.serialize())
  },
}
