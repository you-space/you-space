import Drive from '@ioc:Adonis/Core/Drive'
import Application from '@ioc:Adonis/Core/Application'
import Type from 'App/Models/Type'
import { Types, TypeItemCreate } from '../../types/services'

class Service implements Types {
  public async create(name, schema) {
    const exist = await Drive.exists(schema)

    if (!exist) {
      throw new Error('schema file not found')
    }

    await Drive.copy(schema, Application.makePath('content', 'schemas', `${name}.js`))

    return Type.firstOrCreate({ name }, { name })
  }

  public async createItems(name: string, items: TypeItemCreate[]) {
    const type = await Type.fetchByIdOrName(name).first()

    if (!type) {
      throw new Error('type not found')
    }

    await type.related('items').updateOrCreateMany(items, ['sourceId'])
  }

  public async delete(name: string) {
    const type = await Type.findBy('name', name)

    if (!type) {
      return
    }

    await type.delete()
  }
}

export const types = new Service()
