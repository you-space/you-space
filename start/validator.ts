import path from 'path'

import { validator } from '@ioc:Adonis/Core/Validator'
import { fileExists } from 'App/Helpers'

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

validator.rule(
  'fileExist',
  async (value, [basePath], options) => {
    if (typeof value !== 'string') {
      return
    }

    let filePath = value

    if (basePath) {
      filePath = path.join(basePath, value)
    }

    const exist = await fileExists(filePath)

    if (!exist) {
      options.errorReporter.report(
        options.pointer,
        'fileExist',
        'fileExist validation failed',
        options.arrayExpressionPointer
      )
    }
  },
  () => ({ async: true })
)
