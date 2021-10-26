import { schema, rules } from '@ioc:Adonis/Core/Validator'
import { TypeSchema } from 'App/Models/Type'

export default class ItemIndexValidator {
  constructor(schemas: TypeSchema[]) {
    const validProperties: string[] = []
    const typeSchema = {
      ...this.defaultSchema,
    }

    schemas.forEach((s) =>
      Object.entries(s)
        .filter(([, value]) => !!value.map)
        .forEach(([key, value]) => {
          validProperties.push(key)

          if (value.type === 'string') {
            typeSchema[key] = schema.string.optional()
          }

          if (value.type === 'number') {
            typeSchema[key] = schema.number.optional()
          }
        })
    )

    typeSchema.orderBy = schema.enum.optional(validProperties)

    this.schema = schema.create(typeSchema)
  }

  public defaultSchema = {
    page: schema.number.optional(),
    limit: schema.number.optional([rules.range(1, 40)]),

    id: schema.string.optional({}, [rules.numberArray()]),
    type: schema.string.optional({}, [rules.requiredIfExists('orderBy')]),
    raw: schema.boolean.optional(),

    include: schema.string.optional(),
    search: schema.string.optional(),
    orderBy: schema.string.optional(),
    orderDesc: schema.boolean.optional(),
    pick: schema.string.optional(),
  }

  public schema = schema.create(
    this.defaultSchema as typeof this.defaultSchema & Record<string, any>
  )
}
