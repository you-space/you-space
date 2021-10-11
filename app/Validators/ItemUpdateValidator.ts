import { schema, rules } from '@ioc:Adonis/Core/Validator'
export default class ItemUpdateValidator {
  public schema = schema.create({
    id: schema.number([
      rules.exists({
        table: 'items',
        column: 'id',
      }),
    ]),
    sourceId: schema.string.optional(),
    visibilityId: schema.number.optional(),
    value: schema.object().anyMembers(),
  })
}
