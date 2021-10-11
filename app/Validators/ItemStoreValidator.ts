import { schema } from '@ioc:Adonis/Core/Validator'

export default class ItemStoreValidator {
  public schema = schema.create({
    type: schema.string(),
    sourceId: schema.string.optional(),
    visibilityId: schema.number.optional(),
    value: schema.object().anyMembers(),
  })
}
