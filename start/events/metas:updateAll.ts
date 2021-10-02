import SystemMeta from 'App/Models/SystemMeta'

interface Payload {
  name: string
  value: any
}

export default {
  roles: ['admin'],
  handler: async (metas: Payload[]) => {
    await SystemMeta.updateOrCreateMany('name', metas)
  },
}
