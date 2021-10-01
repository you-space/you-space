import Drive from '@ioc:Adonis/Core/Drive'
import Application from '@ioc:Adonis/Core/Application'
import Type from 'App/Models/Type'

interface Payload {
  name: string
  schema: string
}

export default {
  handler: async ({ name, schema }: Payload) => {
    const distFilename = Application.makePath('content', 'schemas', `${name}.js`)

    const existSource = await Drive.exists(schema)
    const existDestiny = await Drive.exists(distFilename)

    if (!existDestiny) {
      return
    }

    if (!existSource) {
      throw new Error('schema file not found')
    }

    await Drive.copy(schema, distFilename)

    const create = await Type.firstOrCreate({ name }, { name })

    return create.serialize()
  },
}
