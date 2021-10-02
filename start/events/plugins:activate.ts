import Plugin from 'App/Extensions/Plugin'

export default {
  handler: async (name: string) => {
    const plugin = await Plugin.findOrFail(name)

    await plugin.start()
  },
}
