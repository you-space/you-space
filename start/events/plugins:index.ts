import Plugin from 'App/Extensions/Plugin'

export default {
  handler: async () => {
    const plugins = await Plugin.findAll()

    return await Promise.all(
      plugins.map(async (plugin) => ({
        name: plugin.name,
        active: await plugin.isActive(),
      }))
    )
  },
}
