import Drive from '@ioc:Adonis/Core/Drive'
import Application from '@ioc:Adonis/Core/Application'
import Type from 'App/Models/Type'

class Service {
  public async create(name: string, schema: string, options?: Type['options']) {
    const exist = await Drive.exists(schema)

    if (!exist) {
      throw new Error('schema file not found')
    }

    await Drive.copy(schema, Application.makePath('content', 'schemas', `${name}.js`))

    return Type.firstOrCreate({ name }, { name, options })
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
