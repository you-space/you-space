import { schema, rules } from '@ioc:Adonis/Core/Validator'
import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import { OriginScheduleOptions } from 'App/Models/Origin'
export default class OriginValidator {
  constructor(protected ctx: HttpContextContract) {}

  public schema = schema.create({
    name: schema.string.optional({}, [
      rules.unique({
        table: 'origins',
        column: 'name',
        whereNot: {
          id: this.ctx.params.id,
        },
      }),
    ]),
    active: schema.boolean.optional(),
    config: schema.object.optional().anyMembers(),
    schedule: schema.object.optional().members({
      repeatEach: schema.enum(Object.values(OriginScheduleOptions)),
    }),
  })
  public messages = {}
}
