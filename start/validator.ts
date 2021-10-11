import { validator } from '@ioc:Adonis/Core/Validator'

validator.rule('numberArray', (value, _, options) => {
  if (typeof value !== 'string') {
    return
  }

  const ids = value.split(',').map((id) => Number(id))

  const valid = ids.every((id) => !isNaN(id) && id)

  if (!valid) {
    options.errorReporter.report(
      options.pointer,
      'numberArray',
      'numberArray validation failed',
      options.arrayExpressionPointer
    )
  }
})
