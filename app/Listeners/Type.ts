import Application from '@ioc:Adonis/Core/Application'
import Drive from '@ioc:Adonis/Core/Drive'
import Type from 'App/Models/Type'

interface Payload {
  name: string
  schema: string
}

interface Filter {
  page?: number
  limit?: number
}

export default class TypeListener {
  public name = 'Type'

  public async index(filter?: Filter) {
    const query = Type.query()

    const paginate = await query.paginate(filter?.page || 1, filter?.limit)

    return paginate.toJSON()
  }

  public async show(name: string) {
    const type = await Type.fetchByIdOrName(name).first()

    if (!type) {
      throw new Error('type not found')
    }

    return type.serialize()
  }

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

    if (!type) {
      throw new Error('type not found')
    }

    await type.delete()
  }
}
