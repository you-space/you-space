import Type from 'App/Models/Type'
import TypeField from 'App/Models/TypeField'

export default class TypeManager {
  public async create(name: string, options: Type['options']) {
    await Type.updateOrCreate({ name }, { name, options, deletedAt: null })
  }

  public async delete(name: string) {
    const type = await Type.findBy('name', name)

    if (type) {
      await type.delete()
    }
  }

  public async createFields(name: string, fields: TypeField['options'] & { name: string }[]) {
    const type = await Type.findBy('name', name)

    if (!type) {
      throw new Error(`type ${name} not registered`)
    }

    await type.related('fields').updateOrCreateMany(fields, 'name')
  }

  public async deleteFields(name: string, fields: string[]) {
    const type = await Type.findBy('name', name)

    if (!type) {
      throw new Error(`type ${name} not registered`)
    }

    await type.related('fields').query().delete().whereIn('name', fields)
  }
}
