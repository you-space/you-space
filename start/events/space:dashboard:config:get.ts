import SystemMeta from 'App/Models/SystemMeta'

export default {
  handler: async () => {
    const activePages = await SystemMeta.firstOrCreateMetaArray('space:dashboard:active-pages')
    const siteName = await SystemMeta.findBy('name', 'space:site:name')

    return {
      siteName: siteName ? siteName.value : '',
      activePages,
    }
  },
}
