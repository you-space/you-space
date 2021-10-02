import SystemMeta from 'App/Models/SystemMeta'

export default {
  handler: async (name: string) => {
    const meta = await SystemMeta.findBy('name', name)

    return meta ? meta.value : null
  },
}
