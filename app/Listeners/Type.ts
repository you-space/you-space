import Application from '@ioc:Adonis/Core/Application'
import Drive from '@ioc:Adonis/Core/Drive'
import Type from 'App/Models/Type'

interface Payload {
  name: string
  schema: string
}

export default class TypeListener {
  public name = 'Type'

  public async create({ name, schema }: Payload) {
    const distFilename = Application.makePath('content', 'schemas', `${name}.js`)

    const existSource = await Drive.exists(schema)
    const existDestiny = await Drive.exists(distFilename)

    if (!existSource) {
      throw new Error('schema file not found')
    }

    if (!existDestiny) {
      await Drive.copy(schema, distFilename)
    }

    const create = await Type.firstOrCreate({ name }, { name })

    return create.serialize()
  }

  public async delete(name: string) {
    const type = await Type.findBy('name', name)

    if (type) {
      await type.delete()
    }
  }
}
