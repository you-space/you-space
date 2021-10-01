import Type from 'App/Models/Type'

export default {
  handler: async (name: string) => {
    const type = await Type.findBy('name', name)

    if (type) {
      await type.delete()
    }
  },
}
