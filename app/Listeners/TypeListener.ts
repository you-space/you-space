import Drive from '@ioc:Adonis/Core/Drive'
import Type from 'App/Models/Type'
import Content from 'App/Services/ContentService'

interface Payload {
  name: string
  schema: string
}

interface Filter {
  page?: number
  limit?: number
}

export default class TypeListener {
  public async index(filter?: Filter) {
    const query = Type.query()

    const paginate = await query.paginate(filter?.page || 1, filter?.limit)

    return paginate.serialize()
  }

  public async show(name: string) {
    const type = await Type.fetchByIdOrName(name).first()

    if (!type) {
      throw new Error('type not found')
    }

    return type.serialize()
  }

  public async store({ name, schema }: Payload) {
    const existSource = await Drive.exists(schema)

    if (!existSource) {
      throw new Error('schema file not found')
    }

    const create = await Type.firstOrCreate({ name }, { name })

    const distFilename = Content.makePath('schemas', `${create.id}.js`)

    await Drive.copy(schema, distFilename)

    return create.serialize()
  }

  public async destroy(name: string) {
    const type = await Type.fetchByIdOrName(name).first()

    if (!type) {
      throw new Error('type not found')
    }

    await type.delete()
  }
}
