import SystemMeta from 'App/Models/SystemMeta'

export default {
  handler: async (pageName: string) => {
    const name = `space:pages:${pageName}`

    const meta = await SystemMeta.findBy('name', name)

    if (meta) {
      await meta.delete()
    }
  },
}