import { schema } from '@ioc:Adonis/Core/Validator'

export default class CommentShowValidator {
  public schema = schema.create({
    id: schema.number(),
  })
}
